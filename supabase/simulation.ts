/**
 * Driver Position Simulation Script
 *
 * Mengupdate posisi (current_lat, current_lng) semua driver setiap 5 detik
 * untuk mensimulasikan ambulans bergerak di peta.
 *
 * Cara menjalankan:
 *   SUPABASE_URL=https://xxx.supabase.co SUPABASE_SERVICE_ROLE_KEY=xxx npx tsx supabase/simulation.ts
 *
 * Dapatkan SUPABASE_SERVICE_ROLE_KEY dari:
 *   Supabase Dashboard → Project Settings → API → service_role key
 *
 * PENTING: Jangan commit SUPABASE_SERVICE_ROLE_KEY ke repository!
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL ?? ''
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('[simulation] Error: Set env vars SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

const INTERVAL_MS = 5000
const MAX_DELTA = 0.0003 // ~33 meter per step

function randomDelta(): number {
  return (Math.random() - 0.5) * 2 * MAX_DELTA
}

async function tick(): Promise<void> {
  const { data: drivers, error } = await supabase
    .from('drivers')
    .select('id, current_lat, current_lng')

  if (error) {
    console.error('[simulation] Fetch error:', error.message)
    return
  }

  if (!drivers || drivers.length === 0) {
    console.warn('[simulation] Tidak ada driver ditemukan. Pastikan seed.sql sudah dijalankan.')
    return
  }

  const updates = drivers
    .filter((d) => d.current_lat != null && d.current_lng != null)
    .map((d) =>
      supabase
        .from('drivers')
        .update({
          current_lat: (d.current_lat as number) + randomDelta(),
          current_lng: (d.current_lng as number) + randomDelta(),
        })
        .eq('id', d.id)
    )

  await Promise.all(updates)
  console.log(`[${new Date().toLocaleTimeString('id-ID')}] Posisi ${drivers.length} driver diperbarui`)
}

console.log('Simulasi tracking driver dimulai. Tekan Ctrl+C untuk berhenti.\n')
tick()
setInterval(tick, INTERVAL_MS)
