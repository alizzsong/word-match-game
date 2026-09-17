-- ตารางห้องเล่นออนไลน์ของเกมจับคู่คำศัพท์
-- รันคำสั่งนี้ครั้งเดียวตอนตั้งค่า D1 (ดูขั้นตอนใน README.md)
CREATE TABLE IF NOT EXISTS game_rooms (
  code       TEXT PRIMARY KEY,   -- รหัสห้อง 4 หลัก
  state      TEXT NOT NULL,      -- สถานะเกมทั้งห้อง เก็บเป็น JSON
  ver        INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL    -- เวลาแก้ล่าสุด (ms) ใช้ลบห้องเก่าทิ้ง
);
CREATE INDEX IF NOT EXISTS idx_game_rooms_updated ON game_rooms(updated_at);
