import "../styles/global.scss";
import styles from "../styles/app.module.scss";
import { Header } from "../components/Header";
import { Player } from "../components/Player";
import { PlayerConstextProvider } from "../context/playerContext";

function MyApp({ Component, pageProps }) {
  return (
    <PlayerConstextProvider>
      <div className={styles.appWrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerConstextProvider>
  );
}

export default MyApp
