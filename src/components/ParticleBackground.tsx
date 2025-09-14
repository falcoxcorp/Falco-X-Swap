import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import type { Engine } from "tsparticles-engine";

const ParticleBackground = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: {
          enable: true,
          zIndex: 0
        },
        particles: {
          number: {
            value: 80,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: "#ffffff"
          },
          shape: {
            type: "circle"
          },
          opacity: {
            value: 0.2,
            random: false,
            animation: {
              enable: true,
              speed: 1,
              minimumValue: 0.1,
              sync: false
            }
          },
          size: {
            value: 3,
            random: true,
            animation: {
              enable: true,
              speed: 2,
              minimumValue: 0.1,
              sync: false
            }
          },
          links: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.1,
            width: 1
          },
          move: {
            enable: true,
            speed: 2,
            direction: "none",
            random: false,
            straight: false,
            outModes: {
              default: "out"
            },
            attract: {
              enable: true,
              rotateX: 600,
              rotateY: 1200
            }
          },
          interactivity: {
            detectsOn: "window",
            events: {
              onHover: {
                enable: true,
                mode: "repulse"
              },
              onClick: {
                enable: true,
                mode: "push"
              },
              resize: true
            }
          }
        },
        detectRetina: true,
        background: {
          color: "#000000",
          position: "50% 50%",
          repeat: "no-repeat",
          size: "cover"
        }
      }}
    />
  );
};

export default ParticleBackground;