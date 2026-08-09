export default function Step3Choose({ selected, onSelect, onNext, onBack }) {
  return (
    <div className="hhg-panel">
      <div className="hhg-step-head">
        <h2>Choose Your Format</h2>
        <p>Pick a sleek profile frame or a full builder showcase card.</p>
      </div>

      <div className="format-grid">
        {/* PFP Frame */}
        <div
          className={`format-card pfp ${selected === 'pfp' ? 'sel' : ''}`}
          onClick={() => onSelect('pfp')}
        >
          {selected === 'pfp' && <div className="format-check">✓</div>}
          <div className="format-icon">🖼️</div>
          <div className="format-title">PFP Frame</div>
          <div className="format-desc">
            Your photo wrapped in HH Goa branding — perfect for your X / Twitter profile picture.
          </div>
          <div className="format-tag-pill">X PROFILE READY</div>
        </div>

        {/* Builder ID Card */}
        <div
          className={`format-card id ${selected === 'id' ? 'sel' : ''}`}
          onClick={() => onSelect('id')}
        >
          {selected === 'id' && <div className="format-check">✓</div>}
          <div className="format-icon">🪪</div>
          <div className="format-title">Builder ID Card</div>
          <div className="format-desc">
            An event badge with your photo, name, stack, and auto-generated builder title.
          </div>
          <div className="format-tag-pill">POST-READY CARD</div>
        </div>
      </div>

      <div className="nav-btns">
        <button className="btn btn-ghost" onClick={onBack}>← Back</button>
        <button
          className="btn btn-yellow btn-lg"
          disabled={!selected}
          onClick={onNext}
        >
          Choose Style →
        </button>
      </div>
    </div>
  );
}
