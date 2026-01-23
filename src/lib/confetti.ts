// Simple confetti effect without external dependencies
export default function confetti() {
  const colors = ["#10B981", "#3B82F6", "#F59E0B", "#EC4899", "#8B5CF6"];
  const confettiCount = 100;

  for (let i = 0; i < confettiCount; i++) {
    const confettiPiece = document.createElement("div");
    confettiPiece.className = "confetti-piece";
    confettiPiece.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}vw;
      top: -10px;
      opacity: 1;
      transform: rotate(${Math.random() * 360}deg);
      pointer-events: none;
      z-index: 9999;
      border-radius: ${Math.random() > 0.5 ? "50%" : "0"};
    `;

    document.body.appendChild(confettiPiece);

    const animationDuration = 2000 + Math.random() * 2000;
    const horizontalMovement = (Math.random() - 0.5) * 200;

    confettiPiece.animate(
      [
        {
          transform: `translateY(0) translateX(0) rotate(0deg)`,
          opacity: 1,
        },
        {
          transform: `translateY(100vh) translateX(${horizontalMovement}px) rotate(${720 + Math.random() * 360}deg)`,
          opacity: 0,
        },
      ],
      {
        duration: animationDuration,
        easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }
    ).onfinish = () => {
      confettiPiece.remove();
    };
  }
}
