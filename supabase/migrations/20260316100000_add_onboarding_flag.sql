-- Add onboarding_completed flag to profiles
ALTER TABLE profiles ADD COLUMN onboarding_completed boolean NOT NULL DEFAULT false;

-- Existing users have already been "onboarded" (they skip the new flow)
UPDATE profiles SET onboarding_completed = true;
