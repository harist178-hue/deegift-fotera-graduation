#!/bin/bash
set -e

mkdir -p /tmp/chunks public/rendered
rm -f /tmp/chunks/*.mp4 /tmp/chunks/list.txt

echo "=== STARTING 60 FPS RENDER (1200 FRAMES, 6 CHUNKS) ==="

CHUNKS=(
  "0-199"
  "200-399"
  "400-599"
  "600-799"
  "800-999"
  "1000-1199"
)

TOTAL=${#CHUNKS[@]}

for i in "${!CHUNKS[@]}"; do
  RANGE="${CHUNKS[$i]}"
  OUT="/tmp/chunks/chunk_${i}.mp4"
  IDX=$((i + 1))

  echo "[${IDX}/${TOTAL}] Rendering frames ${RANGE} to ${OUT}..."
  npx remotion render src/index.ts GraduationCollab "${OUT}" \
    --frames="${RANGE}" \
    --image-format=jpeg \
    --jpeg-quality=85 \
    --concurrency=2 \
    --overwrite \
    --quiet

  echo "file '${OUT}'" >> /tmp/chunks/list.txt
  echo "[${IDX}/${TOTAL}] Frames ${RANGE} finished successfully."
done

echo "=== CONCATENATING CHUNKS TO FINAL MP4 ==="
ffmpeg -y -f concat -safe 0 -i /tmp/chunks/list.txt -c copy public/rendered/GraduationCollab-60fps.mp4

# Also copy to out/ for direct access
mkdir -p out
cp public/rendered/GraduationCollab-60fps.mp4 out/GraduationCollab-60fps.mp4

echo "=== 60 FPS RENDER COMPLETE ==="
ls -lh public/rendered/GraduationCollab-60fps.mp4
