


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."add_xp"("p_user_id" "uuid", "p_amount" integer, "p_source" "text", "p_description" "text" DEFAULT NULL::"text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
declare
  v_last_practice date;
  v_current_streak integer;
  v_longest_streak integer;
begin
  -- Get current user stats
  select last_practice_date, current_streak, longest_streak
  into v_last_practice, v_current_streak, v_longest_streak
  from public.profiles where id = p_user_id;

  -- Update streak logic
  if v_last_practice is null or v_last_practice < current_date - interval '1 day' then
    v_current_streak := 1;
  elsif v_last_practice = current_date - interval '1 day' then
    v_current_streak := v_current_streak + 1;
  end if;

  if v_current_streak > v_longest_streak then
    v_longest_streak := v_current_streak;
  end if;

  -- Update profile
  update public.profiles
  set
    xp_total = xp_total + p_amount,
    xp_today = case when last_practice_date = current_date then xp_today + p_amount else p_amount end,
    current_streak = v_current_streak,
    longest_streak = v_longest_streak,
    last_practice_date = current_date,
    updated_at = now()
  where id = p_user_id;

  -- Log transaction
  insert into public.xp_transactions (user_id, amount, source, description)
  values (p_user_id, p_amount, p_source, p_description);

  -- Update daily goals
  insert into public.daily_goals (user_id, goal_date, xp_earned)
  values (p_user_id, current_date, p_amount)
  on conflict (user_id, goal_date)
  do update set xp_earned = daily_goals.xp_earned + p_amount;
end;
$$;


ALTER FUNCTION "public"."add_xp"("p_user_id" "uuid", "p_amount" integer, "p_source" "text", "p_description" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', null)
  );
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_room_member_count"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  if TG_OP = 'INSERT' then
    update public.chat_rooms set member_count = member_count + 1 where id = NEW.room_id;
  elsif TG_OP = 'DELETE' then
    update public.chat_rooms set member_count = member_count - 1 where id = OLD.room_id;
  end if;
  return null;
end;
$$;


ALTER FUNCTION "public"."update_room_member_count"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."achievements" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text" NOT NULL,
    "icon" "text" NOT NULL,
    "category" "text" DEFAULT 'general'::"text",
    "xp_reward" integer DEFAULT 50,
    "requirement_type" "text" NOT NULL,
    "requirement_value" integer NOT NULL,
    "is_secret" boolean DEFAULT false,
    "order_index" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."achievements" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "icon" "text",
    "color" "text" DEFAULT '#3B82F6'::"text",
    "order_index" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chat_messages" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "room_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "content" "text" NOT NULL,
    "message_type" "text" DEFAULT 'text'::"text",
    "voice_url" "text",
    "image_url" "text",
    "reply_to_id" "uuid",
    "is_edited" boolean DEFAULT false,
    "is_deleted" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    CONSTRAINT "chat_messages_message_type_check" CHECK (("message_type" = ANY (ARRAY['text'::"text", 'voice'::"text", 'image'::"text", 'system'::"text"])))
);


ALTER TABLE "public"."chat_messages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chat_room_members" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "room_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "joined_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "last_read_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "is_muted" boolean DEFAULT false
);


ALTER TABLE "public"."chat_room_members" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chat_rooms" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "level_requirement" "text" DEFAULT 'beginner'::"text",
    "topic" "text",
    "icon" "text" DEFAULT '💬'::"text",
    "is_active" boolean DEFAULT true,
    "is_official" boolean DEFAULT true,
    "member_count" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."chat_rooms" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."daily_goals" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "goal_date" "date" DEFAULT CURRENT_DATE NOT NULL,
    "lessons_target" integer DEFAULT 1,
    "lessons_completed" integer DEFAULT 0,
    "cards_target" integer DEFAULT 10,
    "cards_completed" integer DEFAULT 0,
    "chat_minutes_target" integer DEFAULT 5,
    "chat_minutes_completed" integer DEFAULT 0,
    "xp_target" integer DEFAULT 50,
    "xp_earned" integer DEFAULT 0,
    "all_goals_met" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."daily_goals" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."direct_messages" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "match_id" "uuid" NOT NULL,
    "sender_id" "uuid" NOT NULL,
    "content" "text" NOT NULL,
    "message_type" "text" DEFAULT 'text'::"text",
    "voice_url" "text",
    "is_read" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    CONSTRAINT "direct_messages_message_type_check" CHECK (("message_type" = ANY (ARRAY['text'::"text", 'voice'::"text", 'image'::"text"])))
);


ALTER TABLE "public"."direct_messages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."exchange_matches" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_a" "uuid" NOT NULL,
    "user_b" "uuid" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text",
    "initiated_by" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    CONSTRAINT "exchange_matches_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'accepted'::"text", 'declined'::"text", 'blocked'::"text"])))
);


ALTER TABLE "public"."exchange_matches" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."exchange_profiles" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "bio" "text",
    "interests" "text"[],
    "availability" "text"[],
    "preferred_topics" "text"[],
    "looking_for" "text" DEFAULT 'conversation'::"text",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."exchange_profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."lessons" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "category_id" "uuid",
    "title" "text" NOT NULL,
    "description" "text",
    "difficulty" integer DEFAULT 1,
    "xp_reward" integer DEFAULT 20,
    "estimated_minutes" integer DEFAULT 10,
    "order_index" integer DEFAULT 0,
    "is_premium" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    CONSTRAINT "lessons_difficulty_check" CHECK ((("difficulty" >= 1) AND ("difficulty" <= 5)))
);


ALTER TABLE "public"."lessons" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."message_corrections" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "message_id" "uuid" NOT NULL,
    "corrector_id" "uuid" NOT NULL,
    "original_text" "text" NOT NULL,
    "corrected_text" "text" NOT NULL,
    "explanation" "text",
    "is_accepted" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."message_corrections" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."message_reactions" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "message_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "emoji" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."message_reactions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ocr_scans" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "image_url" "text",
    "extracted_text" "text" NOT NULL,
    "translated_text" "text",
    "word_count" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."ocr_scans" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."phrases" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "lesson_id" "uuid" NOT NULL,
    "indonesian_text" "text" NOT NULL,
    "english_translation" "text" NOT NULL,
    "pronunciation_guide" "text",
    "audio_url" "text",
    "image_url" "text",
    "example_dialogue_id" "text",
    "example_dialogue_en" "text",
    "grammar_note" "text",
    "order_index" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."phrases" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "username" "text",
    "display_name" "text",
    "avatar_url" "text",
    "native_language" "text" DEFAULT 'en'::"text",
    "learning_level" "text" DEFAULT 'beginner'::"text",
    "xp_total" integer DEFAULT 0,
    "xp_today" integer DEFAULT 0,
    "current_streak" integer DEFAULT 0,
    "longest_streak" integer DEFAULT 0,
    "last_practice_date" "date",
    "timezone" "text" DEFAULT 'Asia/Jakarta'::"text",
    "notifications_enabled" boolean DEFAULT true,
    "sound_enabled" boolean DEFAULT true,
    "dark_mode" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    CONSTRAINT "profiles_learning_level_check" CHECK (("learning_level" = ANY (ARRAY['beginner'::"text", 'elementary'::"text", 'intermediate'::"text", 'upper_intermediate'::"text", 'advanced'::"text"])))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."quiz_answers" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "session_id" "uuid" NOT NULL,
    "card_id" "uuid",
    "phrase_id" "uuid",
    "question_type" "text" NOT NULL,
    "user_answer" "text",
    "correct_answer" "text" NOT NULL,
    "is_correct" boolean NOT NULL,
    "time_spent_ms" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    CONSTRAINT "quiz_answers_question_type_check" CHECK (("question_type" = ANY (ARRAY['multiple_choice'::"text", 'typing'::"text", 'matching'::"text", 'listening'::"text", 'speaking'::"text"])))
);


ALTER TABLE "public"."quiz_answers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."quiz_sessions" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "quiz_type" "text" NOT NULL,
    "total_questions" integer DEFAULT 0,
    "correct_answers" integer DEFAULT 0,
    "incorrect_answers" integer DEFAULT 0,
    "xp_earned" integer DEFAULT 0,
    "time_spent_seconds" integer DEFAULT 0,
    "started_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "completed_at" timestamp with time zone,
    CONSTRAINT "quiz_sessions_quiz_type_check" CHECK (("quiz_type" = ANY (ARRAY['flashcard_review'::"text", 'lesson_quiz'::"text", 'daily_challenge'::"text", 'practice'::"text"])))
);


ALTER TABLE "public"."quiz_sessions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."splash_cards" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "category_id" "uuid",
    "indonesian_text" "text" NOT NULL,
    "english_translation" "text" NOT NULL,
    "pronunciation_guide" "text",
    "audio_url" "text",
    "image_url" "text",
    "example_sentence_id" "text",
    "example_sentence_en" "text",
    "cultural_note" "text",
    "difficulty" integer DEFAULT 1,
    "order_index" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    CONSTRAINT "splash_cards_difficulty_check" CHECK ((("difficulty" >= 1) AND ("difficulty" <= 5)))
);


ALTER TABLE "public"."splash_cards" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_achievements" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "achievement_id" "uuid" NOT NULL,
    "earned_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."user_achievements" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_card_progress" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "card_id" "uuid" NOT NULL,
    "mastery_level" integer DEFAULT 0,
    "times_seen" integer DEFAULT 0,
    "times_correct" integer DEFAULT 0,
    "times_incorrect" integer DEFAULT 0,
    "ease_factor" numeric DEFAULT 2.5,
    "interval_days" integer DEFAULT 1,
    "last_reviewed" timestamp with time zone,
    "next_review" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    CONSTRAINT "user_card_progress_mastery_level_check" CHECK ((("mastery_level" >= 0) AND ("mastery_level" <= 5)))
);


ALTER TABLE "public"."user_card_progress" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_lesson_progress" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "lesson_id" "uuid" NOT NULL,
    "status" "text" DEFAULT 'not_started'::"text",
    "phrases_completed" integer DEFAULT 0,
    "score" integer DEFAULT 0,
    "xp_earned" integer DEFAULT 0,
    "started_at" timestamp with time zone,
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    CONSTRAINT "user_lesson_progress_status_check" CHECK (("status" = ANY (ARRAY['not_started'::"text", 'in_progress'::"text", 'completed'::"text"])))
);


ALTER TABLE "public"."user_lesson_progress" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."xp_transactions" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "amount" integer NOT NULL,
    "source" "text" NOT NULL,
    "source_id" "uuid",
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."xp_transactions" OWNER TO "postgres";


ALTER TABLE ONLY "public"."achievements"
    ADD CONSTRAINT "achievements_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."achievements"
    ADD CONSTRAINT "achievements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chat_messages"
    ADD CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chat_room_members"
    ADD CONSTRAINT "chat_room_members_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."chat_room_members"
    ADD CONSTRAINT "chat_room_members_room_id_user_id_key" UNIQUE ("room_id", "user_id");



ALTER TABLE ONLY "public"."chat_rooms"
    ADD CONSTRAINT "chat_rooms_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."daily_goals"
    ADD CONSTRAINT "daily_goals_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."daily_goals"
    ADD CONSTRAINT "daily_goals_user_id_goal_date_key" UNIQUE ("user_id", "goal_date");



ALTER TABLE ONLY "public"."direct_messages"
    ADD CONSTRAINT "direct_messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."exchange_matches"
    ADD CONSTRAINT "exchange_matches_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."exchange_matches"
    ADD CONSTRAINT "exchange_matches_user_a_user_b_key" UNIQUE ("user_a", "user_b");



ALTER TABLE ONLY "public"."exchange_profiles"
    ADD CONSTRAINT "exchange_profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."exchange_profiles"
    ADD CONSTRAINT "exchange_profiles_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."lessons"
    ADD CONSTRAINT "lessons_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."message_corrections"
    ADD CONSTRAINT "message_corrections_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."message_reactions"
    ADD CONSTRAINT "message_reactions_message_id_user_id_emoji_key" UNIQUE ("message_id", "user_id", "emoji");



ALTER TABLE ONLY "public"."message_reactions"
    ADD CONSTRAINT "message_reactions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ocr_scans"
    ADD CONSTRAINT "ocr_scans_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."phrases"
    ADD CONSTRAINT "phrases_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."quiz_answers"
    ADD CONSTRAINT "quiz_answers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."quiz_sessions"
    ADD CONSTRAINT "quiz_sessions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."splash_cards"
    ADD CONSTRAINT "splash_cards_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_achievements"
    ADD CONSTRAINT "user_achievements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_achievements"
    ADD CONSTRAINT "user_achievements_user_id_achievement_id_key" UNIQUE ("user_id", "achievement_id");



ALTER TABLE ONLY "public"."user_card_progress"
    ADD CONSTRAINT "user_card_progress_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_card_progress"
    ADD CONSTRAINT "user_card_progress_user_id_card_id_key" UNIQUE ("user_id", "card_id");



ALTER TABLE ONLY "public"."user_lesson_progress"
    ADD CONSTRAINT "user_lesson_progress_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_lesson_progress"
    ADD CONSTRAINT "user_lesson_progress_user_id_lesson_id_key" UNIQUE ("user_id", "lesson_id");



ALTER TABLE ONLY "public"."xp_transactions"
    ADD CONSTRAINT "xp_transactions_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_chat_messages_created" ON "public"."chat_messages" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_chat_messages_room" ON "public"."chat_messages" USING "btree" ("room_id");



CREATE INDEX "idx_chat_room_members_room" ON "public"."chat_room_members" USING "btree" ("room_id");



CREATE INDEX "idx_chat_room_members_user" ON "public"."chat_room_members" USING "btree" ("user_id");



CREATE INDEX "idx_daily_goals_user_date" ON "public"."daily_goals" USING "btree" ("user_id", "goal_date");



CREATE INDEX "idx_direct_messages_match" ON "public"."direct_messages" USING "btree" ("match_id");



CREATE INDEX "idx_phrases_lesson" ON "public"."phrases" USING "btree" ("lesson_id");



CREATE INDEX "idx_quiz_sessions_user" ON "public"."quiz_sessions" USING "btree" ("user_id");



CREATE INDEX "idx_splash_cards_category" ON "public"."splash_cards" USING "btree" ("category_id");



CREATE INDEX "idx_user_card_progress_next_review" ON "public"."user_card_progress" USING "btree" ("next_review");



CREATE INDEX "idx_user_card_progress_user" ON "public"."user_card_progress" USING "btree" ("user_id");



CREATE INDEX "idx_user_lesson_progress_user" ON "public"."user_lesson_progress" USING "btree" ("user_id");



CREATE INDEX "idx_xp_transactions_user" ON "public"."xp_transactions" USING "btree" ("user_id");



CREATE OR REPLACE TRIGGER "on_room_member_change" AFTER INSERT OR DELETE ON "public"."chat_room_members" FOR EACH ROW EXECUTE FUNCTION "public"."update_room_member_count"();



ALTER TABLE ONLY "public"."chat_messages"
    ADD CONSTRAINT "chat_messages_reply_to_id_fkey" FOREIGN KEY ("reply_to_id") REFERENCES "public"."chat_messages"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."chat_messages"
    ADD CONSTRAINT "chat_messages_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."chat_rooms"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chat_messages"
    ADD CONSTRAINT "chat_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chat_room_members"
    ADD CONSTRAINT "chat_room_members_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."chat_rooms"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chat_room_members"
    ADD CONSTRAINT "chat_room_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."daily_goals"
    ADD CONSTRAINT "daily_goals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."direct_messages"
    ADD CONSTRAINT "direct_messages_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "public"."exchange_matches"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."direct_messages"
    ADD CONSTRAINT "direct_messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."exchange_matches"
    ADD CONSTRAINT "exchange_matches_initiated_by_fkey" FOREIGN KEY ("initiated_by") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."exchange_matches"
    ADD CONSTRAINT "exchange_matches_user_a_fkey" FOREIGN KEY ("user_a") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."exchange_matches"
    ADD CONSTRAINT "exchange_matches_user_b_fkey" FOREIGN KEY ("user_b") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."exchange_profiles"
    ADD CONSTRAINT "exchange_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."lessons"
    ADD CONSTRAINT "lessons_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."message_corrections"
    ADD CONSTRAINT "message_corrections_corrector_id_fkey" FOREIGN KEY ("corrector_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."message_corrections"
    ADD CONSTRAINT "message_corrections_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "public"."chat_messages"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."message_reactions"
    ADD CONSTRAINT "message_reactions_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "public"."chat_messages"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."message_reactions"
    ADD CONSTRAINT "message_reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ocr_scans"
    ADD CONSTRAINT "ocr_scans_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."phrases"
    ADD CONSTRAINT "phrases_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."quiz_answers"
    ADD CONSTRAINT "quiz_answers_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "public"."splash_cards"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."quiz_answers"
    ADD CONSTRAINT "quiz_answers_phrase_id_fkey" FOREIGN KEY ("phrase_id") REFERENCES "public"."phrases"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."quiz_answers"
    ADD CONSTRAINT "quiz_answers_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."quiz_sessions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."quiz_sessions"
    ADD CONSTRAINT "quiz_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."splash_cards"
    ADD CONSTRAINT "splash_cards_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_achievements"
    ADD CONSTRAINT "user_achievements_achievement_id_fkey" FOREIGN KEY ("achievement_id") REFERENCES "public"."achievements"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_achievements"
    ADD CONSTRAINT "user_achievements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_card_progress"
    ADD CONSTRAINT "user_card_progress_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "public"."splash_cards"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_card_progress"
    ADD CONSTRAINT "user_card_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_lesson_progress"
    ADD CONSTRAINT "user_lesson_progress_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_lesson_progress"
    ADD CONSTRAINT "user_lesson_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."xp_transactions"
    ADD CONSTRAINT "xp_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



CREATE POLICY "Achievements are viewable by everyone" ON "public"."achievements" FOR SELECT USING (true);



CREATE POLICY "Active chat rooms are viewable by everyone" ON "public"."chat_rooms" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Categories are viewable by everyone" ON "public"."categories" FOR SELECT USING (true);



CREATE POLICY "Exchange profiles are viewable by everyone" ON "public"."exchange_profiles" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Lessons are viewable by everyone" ON "public"."lessons" FOR SELECT USING (true);



CREATE POLICY "Phrases are viewable by everyone" ON "public"."phrases" FOR SELECT USING (true);



CREATE POLICY "Public profiles are viewable by everyone" ON "public"."profiles" FOR SELECT USING (true);



CREATE POLICY "Splash cards are viewable by everyone" ON "public"."splash_cards" FOR SELECT USING (true);



CREATE POLICY "System can grant achievements" ON "public"."user_achievements" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "User achievements are viewable by everyone" ON "public"."user_achievements" FOR SELECT USING (true);



CREATE POLICY "Users can add corrections" ON "public"."message_corrections" FOR INSERT WITH CHECK (("auth"."uid"() = "corrector_id"));



CREATE POLICY "Users can add reactions" ON "public"."message_reactions" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create OCR scans" ON "public"."ocr_scans" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create XP transactions" ON "public"."xp_transactions" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create matches" ON "public"."exchange_matches" FOR INSERT WITH CHECK (("auth"."uid"() = "initiated_by"));



CREATE POLICY "Users can create own daily goals" ON "public"."daily_goals" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create quiz sessions" ON "public"."quiz_sessions" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete own OCR scans" ON "public"."ocr_scans" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can edit own messages" ON "public"."chat_messages" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own card progress" ON "public"."user_card_progress" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own exchange profile" ON "public"."exchange_profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own lesson progress" ON "public"."user_lesson_progress" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert quiz answers" ON "public"."quiz_answers" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."quiz_sessions"
  WHERE (("quiz_sessions"."id" = "quiz_answers"."session_id") AND ("quiz_sessions"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can join rooms" ON "public"."chat_room_members" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can leave rooms" ON "public"."chat_room_members" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can remove own reactions" ON "public"."message_reactions" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can send DMs" ON "public"."direct_messages" FOR INSERT WITH CHECK (("auth"."uid"() = "sender_id"));



CREATE POLICY "Users can send messages" ON "public"."chat_messages" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own card progress" ON "public"."user_card_progress" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own daily goals" ON "public"."daily_goals" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own exchange profile" ON "public"."exchange_profiles" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own lesson progress" ON "public"."user_lesson_progress" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own matches" ON "public"."exchange_matches" FOR UPDATE USING ((("auth"."uid"() = "user_a") OR ("auth"."uid"() = "user_b")));



CREATE POLICY "Users can update own profile" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can update own quiz sessions" ON "public"."quiz_sessions" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view DMs in their matches" ON "public"."direct_messages" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."exchange_matches"
  WHERE (("exchange_matches"."id" = "direct_messages"."match_id") AND (("exchange_matches"."user_a" = "auth"."uid"()) OR ("exchange_matches"."user_b" = "auth"."uid"()))))));



CREATE POLICY "Users can view corrections" ON "public"."message_corrections" FOR SELECT USING (true);



CREATE POLICY "Users can view messages in their rooms" ON "public"."chat_messages" FOR SELECT USING (((EXISTS ( SELECT 1
   FROM "public"."chat_room_members"
  WHERE (("chat_room_members"."room_id" = "chat_messages"."room_id") AND ("chat_room_members"."user_id" = "auth"."uid"())))) OR (EXISTS ( SELECT 1
   FROM "public"."chat_rooms"
  WHERE (("chat_rooms"."id" = "chat_messages"."room_id") AND ("chat_rooms"."is_official" = true))))));



CREATE POLICY "Users can view own OCR scans" ON "public"."ocr_scans" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own XP transactions" ON "public"."xp_transactions" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own card progress" ON "public"."user_card_progress" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own daily goals" ON "public"."daily_goals" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own lesson progress" ON "public"."user_lesson_progress" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own matches" ON "public"."exchange_matches" FOR SELECT USING ((("auth"."uid"() = "user_a") OR ("auth"."uid"() = "user_b")));



CREATE POLICY "Users can view own quiz answers" ON "public"."quiz_answers" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."quiz_sessions"
  WHERE (("quiz_sessions"."id" = "quiz_answers"."session_id") AND ("quiz_sessions"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can view own quiz sessions" ON "public"."quiz_sessions" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view reactions" ON "public"."message_reactions" FOR SELECT USING (true);



CREATE POLICY "Users can view room members" ON "public"."chat_room_members" FOR SELECT USING (true);



ALTER TABLE "public"."achievements" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."chat_messages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."chat_room_members" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."chat_rooms" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."daily_goals" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."direct_messages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."exchange_matches" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."exchange_profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."lessons" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."message_corrections" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."message_reactions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ocr_scans" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."phrases" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."quiz_answers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."quiz_sessions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."splash_cards" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_achievements" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_card_progress" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_lesson_progress" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."xp_transactions" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."chat_messages";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."direct_messages";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."message_reactions";



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."add_xp"("p_user_id" "uuid", "p_amount" integer, "p_source" "text", "p_description" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."add_xp"("p_user_id" "uuid", "p_amount" integer, "p_source" "text", "p_description" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."add_xp"("p_user_id" "uuid", "p_amount" integer, "p_source" "text", "p_description" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_room_member_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_room_member_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_room_member_count"() TO "service_role";


















GRANT ALL ON TABLE "public"."achievements" TO "anon";
GRANT ALL ON TABLE "public"."achievements" TO "authenticated";
GRANT ALL ON TABLE "public"."achievements" TO "service_role";



GRANT ALL ON TABLE "public"."categories" TO "anon";
GRANT ALL ON TABLE "public"."categories" TO "authenticated";
GRANT ALL ON TABLE "public"."categories" TO "service_role";



GRANT ALL ON TABLE "public"."chat_messages" TO "anon";
GRANT ALL ON TABLE "public"."chat_messages" TO "authenticated";
GRANT ALL ON TABLE "public"."chat_messages" TO "service_role";



GRANT ALL ON TABLE "public"."chat_room_members" TO "anon";
GRANT ALL ON TABLE "public"."chat_room_members" TO "authenticated";
GRANT ALL ON TABLE "public"."chat_room_members" TO "service_role";



GRANT ALL ON TABLE "public"."chat_rooms" TO "anon";
GRANT ALL ON TABLE "public"."chat_rooms" TO "authenticated";
GRANT ALL ON TABLE "public"."chat_rooms" TO "service_role";



GRANT ALL ON TABLE "public"."daily_goals" TO "anon";
GRANT ALL ON TABLE "public"."daily_goals" TO "authenticated";
GRANT ALL ON TABLE "public"."daily_goals" TO "service_role";



GRANT ALL ON TABLE "public"."direct_messages" TO "anon";
GRANT ALL ON TABLE "public"."direct_messages" TO "authenticated";
GRANT ALL ON TABLE "public"."direct_messages" TO "service_role";



GRANT ALL ON TABLE "public"."exchange_matches" TO "anon";
GRANT ALL ON TABLE "public"."exchange_matches" TO "authenticated";
GRANT ALL ON TABLE "public"."exchange_matches" TO "service_role";



GRANT ALL ON TABLE "public"."exchange_profiles" TO "anon";
GRANT ALL ON TABLE "public"."exchange_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."exchange_profiles" TO "service_role";



GRANT ALL ON TABLE "public"."lessons" TO "anon";
GRANT ALL ON TABLE "public"."lessons" TO "authenticated";
GRANT ALL ON TABLE "public"."lessons" TO "service_role";



GRANT ALL ON TABLE "public"."message_corrections" TO "anon";
GRANT ALL ON TABLE "public"."message_corrections" TO "authenticated";
GRANT ALL ON TABLE "public"."message_corrections" TO "service_role";



GRANT ALL ON TABLE "public"."message_reactions" TO "anon";
GRANT ALL ON TABLE "public"."message_reactions" TO "authenticated";
GRANT ALL ON TABLE "public"."message_reactions" TO "service_role";



GRANT ALL ON TABLE "public"."ocr_scans" TO "anon";
GRANT ALL ON TABLE "public"."ocr_scans" TO "authenticated";
GRANT ALL ON TABLE "public"."ocr_scans" TO "service_role";



GRANT ALL ON TABLE "public"."phrases" TO "anon";
GRANT ALL ON TABLE "public"."phrases" TO "authenticated";
GRANT ALL ON TABLE "public"."phrases" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."quiz_answers" TO "anon";
GRANT ALL ON TABLE "public"."quiz_answers" TO "authenticated";
GRANT ALL ON TABLE "public"."quiz_answers" TO "service_role";



GRANT ALL ON TABLE "public"."quiz_sessions" TO "anon";
GRANT ALL ON TABLE "public"."quiz_sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."quiz_sessions" TO "service_role";



GRANT ALL ON TABLE "public"."splash_cards" TO "anon";
GRANT ALL ON TABLE "public"."splash_cards" TO "authenticated";
GRANT ALL ON TABLE "public"."splash_cards" TO "service_role";



GRANT ALL ON TABLE "public"."user_achievements" TO "anon";
GRANT ALL ON TABLE "public"."user_achievements" TO "authenticated";
GRANT ALL ON TABLE "public"."user_achievements" TO "service_role";



GRANT ALL ON TABLE "public"."user_card_progress" TO "anon";
GRANT ALL ON TABLE "public"."user_card_progress" TO "authenticated";
GRANT ALL ON TABLE "public"."user_card_progress" TO "service_role";



GRANT ALL ON TABLE "public"."user_lesson_progress" TO "anon";
GRANT ALL ON TABLE "public"."user_lesson_progress" TO "authenticated";
GRANT ALL ON TABLE "public"."user_lesson_progress" TO "service_role";



GRANT ALL ON TABLE "public"."xp_transactions" TO "anon";
GRANT ALL ON TABLE "public"."xp_transactions" TO "authenticated";
GRANT ALL ON TABLE "public"."xp_transactions" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































