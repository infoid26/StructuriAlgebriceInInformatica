import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createProgressStore,progressDatabaseSettings} from '../scripts/accounts.mjs';
import {blank,attempt} from '../site/state.js';

test('database URLs require verified TLS without including credentials in errors',()=>{
 const valid='postgresql://example-user:example-password@database.example/course';
 const settings=progressDatabaseSettings({PROGRESS_DATABASE_URL:valid});
 assert.equal(settings.connectionString,valid);assert.deepEqual(settings.connectionOptions.ssl,{rejectUnauthorized:true});
 assert.deepEqual(progressDatabaseSettings({PROGRESS_DATABASE_URL:valid+'?sslmode=verify-full'}).connectionOptions.ssl,{rejectUnauthorized:true});
 for(const connection of [valid+'?sslmode=disable',valid+'?sslmode=require',valid+'?sslmode=prefer',valid+'?ssl=false','https://database.example/course','invalid']){
  assert.throws(()=>progressDatabaseSettings({PROGRESS_DATABASE_URL:connection}),error=>!error.message.includes('example-password'));
 }
});

test('progress uses its own public table without modifying other courses in the same database',async()=>{
 const {PGlite}=createRequire(import.meta.url)('@electric-sql/pglite');
 const database=new PGlite();await database.waitReady;
 const store=createProgressStore({database});
 const user={tenant:'11111111-1111-4111-8111-111111111111',object:'22222222-2222-4222-8222-222222222222'};
 try{
  await database.query('CREATE TABLE public.existing_course_progress (id integer PRIMARY KEY, progress jsonb NOT NULL)');
  await database.query('INSERT INTO public.existing_course_progress VALUES (1, $1::jsonb)',[JSON.stringify({keep:'existing-progress'})]);
  const progress=blank();attempt(progress,'numere-baze-1').value='-2';
  const saved=await store.write(user,0,progress);assert.equal(saved.version,1);assert.deepEqual((await store.read(user)).progress,progress);
  assert.equal((await database.query('SELECT progress FROM public.existing_course_progress WHERE id=1')).rows[0].progress.keep,'existing-progress');
  const tables=(await database.query("SELECT tablename FROM pg_tables WHERE schemaname='public'")).rows.map(row=>row.tablename).sort();
  assert.deepEqual(tables,['existing_course_progress','sai_account_progress']);
 }finally{await database.close();}
});
