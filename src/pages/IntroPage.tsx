import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import IntroCanvas from "@/components/IntroCanvas";

const IntroPage = () => {
  const navigate = useNavigate();
  const handleDone = useCallback(() => {
    navigate("/home", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-950">
      <IntroCanvas onComplete={handleDone} />
    </div>
  );
};

export default IntroPage;
