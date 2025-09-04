-- Clean up test files from videos bucket while preserving all database-referenced files

-- Delete UUID pattern test files
DELETE FROM storage.objects 
WHERE bucket_id = 'videos' 
AND name = '9d21f055-b4f2-4f69-84e2-ff8551503dad/1756051972891.mov';

-- Delete mytest files
DELETE FROM storage.objects 
WHERE bucket_id = 'videos' 
AND name IN (
  'mytest3_es_1749704483990.mp4',
  'mytest_es_1749186653432.mp4',
  'my test 4_es_1749747638873.mp4'
);

-- Delete "New new new" files
DELETE FROM storage.objects 
WHERE bucket_id = 'videos' 
AND name IN (
  'New new new 25,7_es_1753418521285.mp4',
  'New new new 25,7_es_1753419274432.mp4'
);

-- Delete "New test" file
DELETE FROM storage.objects 
WHERE bucket_id = 'videos' 
AND name = 'New test 28.7_es_1753676899207.mp4';

-- Delete "Second try" file
DELETE FROM storage.objects 
WHERE bucket_id = 'videos' 
AND name = 'Second try 25.7_es_1753419261797.mp4';

-- Delete ScreenRecording files
DELETE FROM storage.objects 
WHERE bucket_id = 'videos' 
AND name IN (
  'ScreenRecording_07-14-2025 23-16-42_1_es_1753158331064.mp4',
  'ScreenRecording_07-14-2025 23-16-42_1_es_1753158331300.mp4'
);

-- Delete processed video file
DELETE FROM storage.objects 
WHERE bucket_id = 'videos' 
AND name = 'processed_video.mp4';

-- Delete empty folder placeholder
DELETE FROM storage.objects 
WHERE bucket_id = 'videos' 
AND name = 'processed/.emptyFolderPlaceholder';