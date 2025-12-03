-- Supabase Storage RLS policies for bucket 'photos'
-- Copy-paste this into Supabase SQL Editor and run
-- Fix: use pg_policies.policyname (not polname)

DO $$
BEGIN
  -- SELECT (read/list)
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='storage' AND tablename='objects' AND policyname='anon read photos'
  ) THEN
    EXECUTE 'ALTER POLICY "anon read photos" ON storage.objects USING (bucket_id = ''photos'')';
  ELSE
    EXECUTE 'CREATE POLICY "anon read photos" ON storage.objects FOR SELECT TO anon USING (bucket_id = ''photos'')';
  END IF;

  -- INSERT (uploads/*)
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='storage' AND tablename='objects' AND policyname='anon insert photos uploads'
  ) THEN
    EXECUTE 'ALTER POLICY "anon insert photos uploads" ON storage.objects WITH CHECK (bucket_id = ''photos'' AND position(''uploads/'' in name) = 1)';
  ELSE
    EXECUTE 'CREATE POLICY "anon insert photos uploads" ON storage.objects FOR INSERT TO anon WITH CHECK (bucket_id = ''photos'' AND position(''uploads/'' in name) = 1)';
  END IF;

  -- UPDATE (for upsert to overwrite same path under uploads/*)
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='storage' AND tablename='objects' AND policyname='anon update photos uploads'
  ) THEN
    EXECUTE 'ALTER POLICY "anon update photos uploads" ON storage.objects USING (bucket_id = ''photos'' AND position(''uploads/'' in name) = 1) WITH CHECK (bucket_id = ''photos'' AND position(''uploads/'' in name) = 1)';
  ELSE
    EXECUTE 'CREATE POLICY "anon update photos uploads" ON storage.objects FOR UPDATE TO anon USING (bucket_id = ''photos'' AND position(''uploads/'' in name) = 1) WITH CHECK (bucket_id = ''photos'' AND position(''uploads/'' in name) = 1)';
  END IF;

  -- DELETE (uploads/*)
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='storage' AND tablename='objects' AND policyname='anon delete photos uploads'
  ) THEN
    EXECUTE 'ALTER POLICY "anon delete photos uploads" ON storage.objects USING (bucket_id = ''photos'' AND position(''uploads/'' in name) = 1)';
  ELSE
    EXECUTE 'CREATE POLICY "anon delete photos uploads" ON storage.objects FOR DELETE TO anon USING (bucket_id = ''photos'' AND position(''uploads/'' in name) = 1)';
  END IF;
END $$;

-- Inspect current policies
-- SELECT policyname, cmd, qual, with_check FROM pg_policies WHERE schemaname='storage' AND tablename='objects';
