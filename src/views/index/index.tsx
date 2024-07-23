import React from "react";
import { useNavigate } from "react-router-dom";

const Index: React.FC = () => {
  const navigator = useNavigate();

  const onJump = () => {
    navigator('/test');
  }

  return (
    <>
      <span onClick={onJump}>This is Index</span>
    </>
  );
}
export default Index;
