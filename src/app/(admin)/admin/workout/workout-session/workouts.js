// create table public.workouts ( id serial, name character varying(255) not null, user_id uuid null, created_at timestamp with time zone null default current_timestamp, constraint workouts_pkey primary key (id), constraint workouts_user_id_fkey foreign key (user_id) references auth.users (id) ) tablespace pg_default

// create table
//   public.workout_logs (
//     id uuid not null default uuid_generate_v4 (),
//     workout_id integer not null,
//     user_id uuid not null,
//     exercise_id integer not null,
//     set_number integer not null,
//     reps_completed integer not null,
//     weight_completed numeric(10, 2) not null,
//     rpe integer not null,
//     started_at timestamp without time zone not null,
//     completed_at timestamp without time zone null,
//     workout_session_id uuid null,
//     constraint workout_logs_pkey primary key (id),
//     constraint workout_logs_exercise_id_fkey foreign key (exercise_id) references exercises (id),
//     constraint workout_logs_user_id_fkey foreign key (user_id) references auth.users (id),
//     constraint workout_logs_workout_id_fkey foreign key (workout_id) references workouts (id),
//     constraint workout_logs_workout_session_id_fkey foreign key (workout_session_id) references workout_sessions (id)
//   ) tablespace pg_default;

// create table
//   public.workout_exercises (
//     id serial,
//     workout_id integer null,
//     exercise_id integer null,
//     sets integer not null,
//     reps integer not null,
//     weight numeric(10, 2) not null,
//     rest_timer_duration integer null,
//     constraint workout_exercises_pkey primary key (id),
//     constraint workout_exercises_exercise_id_fkey foreign key (exercise_id) references exercises (id) on delete cascade,
//     constraint workout_exercises_workout_id_fkey foreign key (workout_id) references workouts (id) on delete cascade
//   ) tablespace pg_default;

// create table
//   public.exercises (
//     id serial,
//     name character varying(255) not null,
//     user_id uuid null,
//     body_part character varying(255) null,
//     constraint exercises_pkey primary key (id),
//     constraint exercises_user_id_fkey foreign key (user_id) references auth.users (id)
//   ) tablespace pg_default;


// write a component that creates a workout session using these tables. This is for a nextjs project that uses supabase and tailwind css. There are shad/cn components located in '@/components/ui/component-name

// the supabase clients for server components are located in '@/utils/supabase/server' and it's exported as createClient function

// to get a users data use 

// const supabase = createClient()

// const user = supabase.auth.getUser()

// the supabase clients for client components are located in '@/utils/supabase/client' and it's exported as createClient as well, but can only be used in client components marked 'use client; at the top of the component. 

// shadcn components:

// AccordionAlertAlert DialogAspect RatioAvatarBadgeBreadcrumbNewButtonCalendarCardCarouselCheckboxCollapsibleComboboxCommandContext MenuData TableDate PickerDialogDrawerDropdown MenuFormHover CardInputInput OTPNewLabelMenubarNavigation MenuPaginationPopoverProgressRadio GroupResizableScroll AreaSelectSeparatorSheetSkeletonSliderSonnerSwitchTableTabsTextareaToastToggleToggle GroupTooltip

// Workouts has the users workout templates they have created

// workout_exercises are the exercises they assigned to that workout and the weights/reps that are their baseline

// workout_logs will store the data from each workout session

// workout_sessions starts and stops new sessions and is attached to the logs

// exercises is just a database of exercises they can choose from when building workouts.

// during a workout sessions, users progress through all of their exercises, sets, and mark the weight, reps, and rpe for each of the sets. Then when they do the same workout again they can see how much weight reps and rpe they had on the last time they did that workout, hoping to slightly improve. Write all of the data fetching and functions required to "run" a workout using rest timers and moving starting the next timer when users fill out all of the data for that specific workout exercises set. 

// put this all into page.jsx

// Here are all of the table definitions so you can use the correct supabase functions

