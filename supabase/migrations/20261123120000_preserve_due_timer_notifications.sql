-- A timer completion write can arrive just after its deadline. Preserve that
-- due notification so process-queue can deliver it instead of cancelling it
-- while the client advances the timer state.
CREATE OR REPLACE FUNCTION public.handle_timer_notification_sync()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  user_settings JSONB;
  timer_settings JSONB;
  session_threshold INT;
  auto_start_break BOOLEAN;
  auto_start_focus BOOLEAN;
  cur_mode TEXT := NEW.mode;
  cur_ends_at TIMESTAMPTZ := NEW.ends_at;
  cur_completed_sessions INT := NEW.completed_sessions;
  next_mode TEXT;
  next_running BOOLEAN;
  next_completed_sessions INT;
  next_duration_minutes NUMERIC;
  payload_title TEXT;
  payload_body TEXT;
  depth INT := 0;
  MAX_CHAIN_DEPTH CONSTANT INT := 5;
BEGIN
  IF TG_OP = 'UPDATE'
    AND NEW.is_running IS NOT DISTINCT FROM OLD.is_running
    AND NEW.ends_at IS NOT DISTINCT FROM OLD.ends_at
    AND NEW.mode IS NOT DISTINCT FROM OLD.mode
    AND NEW.completed_sessions IS NOT DISTINCT FROM OLD.completed_sessions
    AND NEW.active_task_id IS NOT DISTINCT FROM OLD.active_task_id
    AND NEW.settings IS NOT DISTINCT FROM OLD.settings
  THEN
    RETURN NEW;
  END IF;

  UPDATE public.notification_queue
  SET status = 'cancelled'
  WHERE user_id = NEW.user_id
    AND status = 'pending'
    AND type = 'timer_end'
    AND scheduled_at > now();

  IF NEW.is_running AND NEW.ends_at IS NOT NULL THEN
    SELECT settings INTO user_settings FROM public.profiles WHERE id = NEW.user_id;

    IF (user_settings->'notifications'->>'timer_alerts')::boolean IS NOT FALSE THEN
      timer_settings := NEW.settings;
      session_threshold := COALESCE((timer_settings->>'sessionsBeforeLongBreak')::int, 4);
      auto_start_break := COALESCE((timer_settings->>'autoStartBreak')::boolean, false);
      auto_start_focus := COALESCE((timer_settings->>'autoStartFocus')::boolean, false);

      WHILE depth < MAX_CHAIN_DEPTH LOOP
        depth := depth + 1;

        payload_title := CASE WHEN cur_mode = 'focus' THEN 'Focus Complete' ELSE 'Break Complete' END;
        payload_body := CASE
          WHEN cur_mode = 'focus' THEN 'Your focus session is complete. Take a break!'
          ELSE 'Your break is over. Time to focus!'
        END;

        INSERT INTO public.notification_queue (user_id, scheduled_at, type, payload, reference_id)
        VALUES (
          NEW.user_id,
          cur_ends_at,
          'timer_end',
          jsonb_build_object(
            'title', payload_title,
            'body', payload_body,
            'data', jsonb_build_object('url', '/focus', 'taskId', NEW.active_task_id)
          ),
          NULL
        );

        IF cur_mode = 'focus' THEN
          next_completed_sessions := cur_completed_sessions + 1;
          next_mode := CASE
            WHEN next_completed_sessions >= session_threshold THEN 'longBreak'
            ELSE 'shortBreak'
          END;
          next_running := auto_start_break;
        ELSE
          next_mode := 'focus';
          next_running := auto_start_focus;
          next_completed_sessions := CASE
            WHEN cur_mode = 'longBreak' THEN 0
            ELSE cur_completed_sessions
          END;
        END IF;

        EXIT WHEN NOT next_running;

        next_duration_minutes := CASE next_mode
          WHEN 'focus' THEN COALESCE((timer_settings->>'focusDuration')::numeric, 25)
          WHEN 'shortBreak' THEN COALESCE((timer_settings->>'shortBreakDuration')::numeric, 5)
          WHEN 'longBreak' THEN COALESCE((timer_settings->>'longBreakDuration')::numeric, 15)
        END;

        cur_ends_at := cur_ends_at + (next_duration_minutes * interval '1 minute');
        cur_mode := next_mode;
        cur_completed_sessions := next_completed_sessions;
      END LOOP;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;
