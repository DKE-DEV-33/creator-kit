-- Seed data for CreatorKit (PostgreSQL)

INSERT INTO teams (id, name, region, reporting_window, approval_sla_hours, content_cadence_per_week, ai_preferences) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Pulse Creative', 'San Francisco, CA', 'Weekly', 48, 2,
   '[{"label":"Auto-generate brief drafts","description":"Create AI drafts when a campaign is created.","enabled":true},{"label":"Require approvals before publishing","description":"Block content from scheduling without a reviewer sign-off.","enabled":true},{"label":"Weekly performance digest","description":"Email summary to campaign owners every Monday at 9 AM.","enabled":false}]');

INSERT INTO users (id, team_id, email, name) VALUES
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'demo@pulsecreative.com', 'Jordan Lee');

INSERT INTO creators (id, team_id, name, avatar_url, email) VALUES
  ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Avery Chen', NULL, 'avery@creators.com'),
  ('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'Riley Patel', NULL, 'riley@creators.com');

INSERT INTO platform_accounts (id, creator_id, platform, handle, external_id) VALUES
  ('55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', 'youtube', '@averyplays', 'UCAVERY001'),
  ('66666666-6666-6666-6666-666666666666', '44444444-4444-4444-4444-444444444444', 'youtube', '@rileycooks', 'UCRILEY002');

INSERT INTO campaigns (id, team_id, name, status, start_date, end_date) VALUES
  ('77777777-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111', 'GlowUp Launch', 'active', '2026-02-01', '2026-03-15'),
  ('88888888-8888-8888-8888-888888888888', '11111111-1111-1111-1111-111111111111', 'Spring Refresh', 'draft', '2026-03-20', '2026-04-30');

INSERT INTO campaign_creators (campaign_id, creator_id) VALUES
  ('77777777-7777-7777-7777-777777777777', '33333333-3333-3333-3333-333333333333'),
  ('77777777-7777-7777-7777-777777777777', '44444444-4444-4444-4444-444444444444');

INSERT INTO briefs (id, campaign_id, summary, objectives, keywords, deliverables) VALUES
  ('99999999-9999-9999-9999-999999999999', '77777777-7777-7777-7777-777777777777',
   'Launch GlowUp skincare to Gen Z with creator-led tutorials.',
   'Drive awareness and 3% click-through to landing page.',
   'glowup, skincare routine, dewy skin, morning routine',
   '2x YouTube videos per creator, 1x short clip, 1x community post');

INSERT INTO tasks (id, campaign_id, title, status, due_date) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '77777777-7777-7777-7777-777777777777', 'Draft first video concept', 'in_progress', '2026-02-08'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '77777777-7777-7777-7777-777777777777', 'Review script outline', 'todo', '2026-02-10');

INSERT INTO content_items (id, campaign_id, creator_id, platform, title, status, scheduled_at) VALUES
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '77777777-7777-7777-7777-777777777777', '33333333-3333-3333-3333-333333333333', 'youtube', 'GlowUp AM Routine', 'scheduled', '2026-02-12T16:00:00Z'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '77777777-7777-7777-7777-777777777777', '44444444-4444-4444-4444-444444444444', 'youtube', 'Dewy Skin 5-Min Hacks', 'draft', NULL);

INSERT INTO kpi_snapshots (id, campaign_id, creator_id, platform, views, likes, comments, shares, collected_at) VALUES
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '77777777-7777-7777-7777-777777777777', '33333333-3333-3333-3333-333333333333', 'youtube', 12400, 980, 120, 40, '2026-02-03T12:00:00Z'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', '77777777-7777-7777-7777-777777777777', '44444444-4444-4444-4444-444444444444', 'youtube', 9800, 760, 98, 30, '2026-02-03T12:00:00Z');

INSERT INTO integrations (id, team_id, platform, status, access_token, refresh_token, connected_at) VALUES
  ('12121212-1212-1212-1212-121212121212', '11111111-1111-1111-1111-111111111111', 'youtube', 'connected', 'demo-access-token', 'demo-refresh-token', '2026-02-01T12:00:00Z'),
  ('13131313-1313-1313-1313-131313131313', '11111111-1111-1111-1111-111111111111', 'tiktok', 'disconnected', NULL, NULL, NULL),
  ('14141414-1414-1414-1414-141414141414', '11111111-1111-1111-1111-111111111111', 'instagram', 'disconnected', NULL, NULL, NULL);

INSERT INTO ai_logs (id, team_id, user_id, type, prompt, output) VALUES
  ('15151515-1515-1515-1515-151515151515', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222',
   'brief_draft',
   'Generate a campaign brief for GlowUp targeting Gen Z with 2 creators.',
   'Draft brief created: focus on dewy skin routines, 2 long-form videos, 1 short per creator.');
