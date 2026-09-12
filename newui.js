"use client";

import React, { useId } from "react";

const GLASS_EASING = "cubic-bezier(0.175, 0.885, 0.32, 2.2)";

const BACKGROUND_IMAGE =
  'linear-gradient(rgba(4, 9, 18, 0.08), rgba(4, 9, 18, 0.2)), url("https://images.unsplash.com/photo-1432251407527-504a6b4174a2?q=80&w=1800&auto=format&fit=crop")';

const GlassEffect = ({
  children,
  className = "",
  style = {},
  href,
  target = "_blank",
  filterId,
  ariaLabel,
}) => {
  const content = (
    <div
      className={`
        group relative z-10 flex cursor-pointer
        overflow-visible font-semibold text-black
        transition-all duration-700
        hover:z-50 focus-within:z-50
        ${className}
      `}
      style={{
        boxShadow:
          "0 8px 18px rgba(0, 0, 0, 0.18), 0 0 30px rgba(0, 0, 0, 0.08)",
        transitionTimingFunction: GLASS_EASING,
        ...style,
      }}
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-0
          overflow-hidden rounded-[inherit]
        "
      >
        {/* Distorted glass backdrop */}
        <div
          className="absolute inset-0 z-0 rounded-[inherit]"
          style={{
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            filter: `url(#${filterId})`,
            isolation: "isolate",
          }}
        />

        {/* Transparent white glass surface */}
        <div
          className="absolute inset-0 z-10 rounded-[inherit]"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.34), rgba(255,255,255,0.12))",
          }}
        />

        {/* Inner glass reflections */}
        <div
          className="absolute inset-0 z-20 rounded-[inherit]"
          style={{
            boxShadow: [
              "inset 2px 2px 1px rgba(255,255,255,0.64)",
              "inset -1px -1px 1px rgba(255,255,255,0.38)",
              "inset 0 0 24px rgba(255,255,255,0.08)",
            ].join(", "),
          }}
        />

        {/* Top shine */}
        <div
          className="
            absolute inset-x-5 top-0 z-20 h-px
            bg-gradient-to-r
            from-transparent via-white/90 to-transparent
          "
        />
      </div>

      {/* Content stays above the clipped glass layers */}
      <div className="relative z-30 w-full overflow-visible">
        {children}
      </div>
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <a
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      aria-label={ariaLabel}
      className="
        relative z-10 block overflow-visible
        hover:z-50 focus-visible:z-50
      "
    >
      {content}
    </a>
  );
};

const GlassDock = ({ icons, href, filterId }) => {
  return (
    <div className="relative z-10 overflow-visible hover:z-50">
      <GlassEffect
        href={href}
        filterId={filterId}
        ariaLabel="Open creator profile"
        className="
          rounded-[1.75rem] p-2
          hover:scale-[1.025]
          hover:rounded-[2.15rem] hover:p-3
          sm:p-3 sm:hover:p-4
        "
      >
        <div
          className="
            relative flex items-center justify-center
            gap-1 overflow-visible rounded-[1.5rem]
            px-1 sm:gap-2
          "
        >
          {icons.map((icon) => (
            <div
              key={icon.alt}
              className="
                relative z-0 flex shrink-0 items-center justify-center
                overflow-visible hover:z-40
              "
            >
              <img
                src={icon.src}
                alt={icon.alt}
                draggable={false}
                onClick={(event) => {
                  if (!icon.onClick) return;

                  event.preventDefault();
                  event.stopPropagation();
                  icon.onClick();
                }}
                className="
                  relative z-10
                  h-11 w-11 shrink-0
                  cursor-pointer select-none object-contain
                  transition-all duration-700
                  hover:-translate-y-2 hover:scale-110
                  sm:h-14 sm:w-14
                  md:h-16 md:w-16
                "
                style={{
                  transformOrigin: "center bottom",
                  transitionTimingFunction: GLASS_EASING,
                }}
              />
            </div>
          ))}
        </div>
      </GlassEffect>
    </div>
  );
};

const GlassButton = ({ children, href, filterId }) => {
  return (
    <div className="relative z-10 overflow-visible hover:z-50">
      <GlassEffect
        href={href}
        filterId={filterId}
        ariaLabel="Open creator profile"
        className="
          rounded-[1.75rem] px-7 py-5
          hover:z-50
          hover:-translate-y-1
          hover:scale-[1.025]
          hover:rounded-[2rem]
          hover:px-9 hover:py-6
          sm:px-10 sm:py-6
          sm:hover:px-11 sm:hover:py-7
        "
        style={{
          transformOrigin: "center center",
        }}
      >
        <div
          className="
            relative z-30
            transition-transform duration-700
            group-hover:scale-95
          "
          style={{
            transitionTimingFunction: GLASS_EASING,
          }}
        >
          {children}
        </div>
      </GlassEffect>
    </div>
  );
};

const GlassFilter = ({ id }) => {
  return (
    <svg
      aria-hidden="true"
      width="0"
      height="0"
      className="pointer-events-none absolute"
    >
      <defs>
        <filter
          id={id}
          x="-40%"
          y="-40%"
          width="180%"
          height="180%"
          filterUnits="objectBoundingBox"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.001 0.005"
            numOctaves="1"
            seed="17"
            result="turbulence"
          />

          <feComponentTransfer in="turbulence" result="mapped">
            <feFuncR
              type="gamma"
              amplitude="1"
              exponent="10"
              offset="0.5"
            />

            <feFuncG
              type="gamma"
              amplitude="0"
              exponent="1"
              offset="0"
            />

            <feFuncB
              type="gamma"
              amplitude="0"
              exponent="1"
              offset="0.5"
            />
          </feComponentTransfer>

          <feGaussianBlur
            in="turbulence"
            stdDeviation="3"
            result="softMap"
          />

          <feSpecularLighting
            in="softMap"
            surfaceScale="5"
            specularConstant="1"
            specularExponent="100"
            lightingColor="white"
            result="specLight"
          >
            <fePointLight x="-200" y="-200" z="300" />
          </feSpecularLighting>

          <feComposite
            in="specLight"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1"
            k4="0"
            result="litImage"
          />

          <feDisplacementMap
            in="SourceGraphic"
            in2="softMap"
            scale="200"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
};

const RollingBackground = () => {
  return (
    <div
      aria-hidden="true"
      className="
        pointer-events-none absolute inset-0
        z-0 overflow-hidden
      "
    >
      <div className="liquid-background-roll">
        <div
          className="liquid-background-panel"
          style={{ backgroundImage: BACKGROUND_IMAGE }}
        />

        <div
          className="liquid-background-panel"
          style={{ backgroundImage: BACKGROUND_IMAGE }}
        />
      </div>

      <div className="absolute inset-0 bg-black/5" />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, transparent 20%, rgba(0,0,0,0.16) 100%)",
        }}
      />
    </div>
  );
};

export const Component = () => {
  const generatedId = useId();
  const filterId = `liquid-glass-${generatedId.replace(/:/g, "")}`;

  const dockIcons = [
    {
      src: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/a13d1acfd046f503f987c1c95af582c8_low_res_Claude.png",
      alt: "Claude",
    },
    {
      src: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/9e80c50a5802d3b0a7ec66f3fe4ce348_low_res_Finder.png",
      alt: "Finder",
    },
    {
      src: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/c2c4a538c2d42a8dc0927d7d6530d125_low_res_ChatGPT___Liquid_Glass__Default_.png",
      alt: "ChatGPT",
    },
    {
      src: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/6d26d432bd65c522b0708185c0768ec3_low_res_Maps.png",
      alt: "Maps",
    },
    {
      src: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/7c59c945731aecf4f91eb8c2c5f867ce_low_res_Safari.png",
      alt: "Safari",
    },
    {
      src: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/b7f24edc7183f63dbe34c1943bef2967_low_res_Steam___Liquid_Glass__Default_.png",
      alt: "Steam",
    },
  ];

  return (
    <main
      className="
        relative flex min-h-screen w-full
        items-center justify-center
        overflow-hidden p-4 font-light
      "
    >
      <style>{`
        @keyframes liquidBackgroundRollUp {
          from {
            transform: translate3d(0, 0, 0);
          }

          to {
            transform: translate3d(0, -50%, 0);
          }
        }

        .liquid-background-roll {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 200%;
          animation: liquidBackgroundRollUp 28s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
          transform: translateZ(0);
        }

        .liquid-background-panel {
          width: 100%;
          height: 50%;
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;
          transform: scale(1.015);
        }

        @media (max-width: 640px) {
          .liquid-background-panel {
            background-size: auto 100%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .liquid-background-roll {
            animation: none;
          }
        }
      `}</style>

      <GlassFilter id={filterId} />

      <RollingBackground />

      <div
        className="
          relative z-20 flex w-full
          items-center justify-center
          overflow-visible px-4 py-20
          sm:py-24
        "
      >
        <div
          className="
            relative flex w-full flex-col
            items-center justify-center
            gap-5 overflow-visible
            sm:gap-6
          "
        >
          <GlassDock
            icons={dockIcons}
            href="https://x.com/notsurajgaud"
            filterId={filterId}
          />

          <GlassButton
            href="https://x.com/notsurajgaud"
            filterId={filterId}
          >
            <p
              className="
                whitespace-nowrap text-center
                text-base font-medium text-white
                drop-shadow-md sm:text-xl
              "
            >
              How can I help you today?
            </p>
          </GlassButton>
        </div>
      </div>
    </main>
  );
};

export default Component;