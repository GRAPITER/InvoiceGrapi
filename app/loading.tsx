export default function Loading() {
  const styles = {
    body: {
      margin: 0,
      fontFamily: "Arial, sans-serif",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    },
    loaderWrapper: {
      width: "148px",
      height: "100px",
      position: "relative",
    },
    loader: {
      width: "148px",
      height: "100px",
      position: "absolute",
    },
    roller: {
      width: "70px",
      height: "70px",
      position: "absolute",
      top: 0,
      left: 0,
      animation: "rollercoaster 1.2s infinite linear",
      transform: "rotate(135deg)",
    },
    rollerLastChild: {
      left: "auto",
      right: 0,
      transform: "rotate(-45deg)",
      animation: "rollercoaster2 1.2s infinite linear",
    },
  };

  return (
    <>
      <style>
        {`
          @keyframes rollercoaster {
            0% { transform: rotate(135deg); }
            100% { transform: rotate(495deg); }
          }

          @keyframes rollercoaster2 {
            0% { transform: rotate(-45deg); }
            100% { transform: rotate(315deg); }
          }

          .roller::before {
            content: "";
            display: block;
            width: 15px;
            height: 15px;
            background: #000;
            border-radius: 50%;
          }

          .loader::after {
            content: "";
            position: absolute;
            display: block;
            animation: shadow 1.2s infinite linear;
            bottom: 0em;
            left: 0;
            height: 0.25em;
            width: 1em;
            border-radius: 50%;
           
            opacity: 0.3;
          }

          @keyframes shadow {
            0%, 100% { transform: scaleX(1); opacity: 0.3; }
            50% { transform: scaleX(0.5); opacity: 0.7; }
          }
        `}
      </style>
      <div style={styles.body}>
        <div style={styles.loaderWrapper}>
          <div style={styles.loader} className="loader">
            <div style={styles.roller} className="roller"></div>
            <div
              style={{ ...styles.roller, ...styles.rollerLastChild }}
              className="roller"
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}
