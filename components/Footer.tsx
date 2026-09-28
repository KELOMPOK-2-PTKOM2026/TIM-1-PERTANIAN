import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      {/* Background image */}
      <div className="footer-background" />

      {/* Isi footer */}
      <div className="footer-overlay">
        <div className="footer-kiri">
          <img
            src="/tanimajulogo.png"
            alt="Logo Tanimaju"
            className="logo-full"
          />

          <p>
            Setapak demi setapak, selangkah demi selangkah — timba pengalaman,
            perkaya wawasan, dan pantau harga pasar sebelum menjual panen.
          </p>
        </div>

        <div className="footer-menu">
          <div className="kolom">
            <h4>About</h4>
            <ul>
              <li>
                <a href="#">Tentang kami</a>
              </li>
              <li>
                <a href="#">Tentang kami</a>
              </li>
              <li>
                <a href="#">Tentang kami</a>
              </li>
            </ul>
          </div>

          <div className="kolom">
            <h4>About</h4>
            <ul>
              <li>
                <a href="#">Tentang kami</a>
              </li>
              <li>
                <a href="#">Tentang kami</a>
              </li>
              <li>
                <a href="#">Tentang kami</a>
              </li>
            </ul>
          </div>

          <div className="kolom">
            <h4>Contact Support</h4>
            <ul>
              <li>
                <a href="#">Tentang kami</a>
              </li>
              <li>
                <a href="#">Tentang kami</a>
              </li>
              <li>
                <a href="#">Tentang kami</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
