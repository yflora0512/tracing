/**
 * Clearly marked slot for a video that still has to be shot.
 * Says what the video is for, its length/ratio, and the shot list, so it can be produced and dropped in.
 */
export default function VideoSlot({ no, title, purpose, len, ratio = '16 / 9', ratioLabel = '16:9', shots, note }) {
  return (
    <figure className="vslot">
      <div className="vslot__screen" style={{ aspectRatio: ratio }}>
        <span className="vslot__tag">Video {no} · 영상 자리 · 추가 자료 필요</span>
        <span className="vslot__play" aria-hidden="true" />
        <span className="vslot__title">{title}</span>
        <span className="vslot__spec">
          {len} · {ratioLabel}
        </span>
      </div>
      <figcaption className="vslot__cap">
        <div>
          <span className="vslot__k">Purpose</span>
          <p>{purpose}</p>
          {note && <p className="vslot__note">{note}</p>}
        </div>
        <div>
          <span className="vslot__k">Shot List</span>
          <ol>
            {shots.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </div>
      </figcaption>
    </figure>
  );
}
