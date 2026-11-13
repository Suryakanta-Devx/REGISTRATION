import './LoadingScreen.css';

const LoadingScreen = ({ subtitle = 'Welcome to all Abitans • Ignitron 2K26' }) => {
  return (
    <div className="ignitron-loader-overlay" role="status" aria-live="polite">
      <div className="ignitron-loader-ring-wrap">
        <div className="ignitron-loader-ring-outer" />
        <div className="ignitron-loader-ring-inner" />
        <div className="ignitron-loader-core">2K26</div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', letterSpacing: '0.04em' }}>
          IGNITRON <span className="text-gradient">2K26</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
          {subtitle}
        </p>
      </div>

      <div className="ignitron-loader-bar-track">
        <div className="ignitron-loader-bar-fill" />
      </div>
    </div>
  );
};

export default LoadingScreen;
