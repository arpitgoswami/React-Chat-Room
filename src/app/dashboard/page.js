"use client";

import { useAuth } from "../firebase";
import { useState, useEffect } from "react";

import Sidebar from "../../components/Sidebar";
import InputForm from "../../components/InputForm";
import ResponseDisplay from "../../components/ResponseDisplay";
import DashboardFooter from "../../components/DashboardFooter";
import Header from "../../components/Header";

export default function Dashboard() {
  const user = useAuth();
  const [aiResponse, setAiResponse] = useState("");
  const [sources, setSources] = useState([]);
  const [userPrompt, setUserPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setShowContent(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userPrompt.trim() || isLoading) return;

    setIsLoading(true);
    setAiResponse("");

    try {
      const response = await fetch("/api/ai-generation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: userPrompt,
          user,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        setAiResponse((prev) => prev + chunk);
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setAiResponse("Error generating response.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 flex flex-col md:flex-row">
      {""}
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      <div className="flex-1 flex flex-col md:ml-64">
        <Header onMenuClick={toggleSidebar} />
        <div className="flex-1 flex flex-col overflow-y-auto">
          {" "}
          <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 md:py-10 max-w-full">
            <div
              className={`transition-opacity h-full duration-500 ease-out ${
                showContent ? "opacity-100" : "opacity-0"
              }`}
            >
              <InputForm
                userPrompt={userPrompt}
                setUserPrompt={setUserPrompt}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                isEnhancing={isEnhancing}
                setIsEnhancing={setIsEnhancing}
                user={user}
                setAiResponse={setAiResponse}
                disabled={isLoading ? "hidden" : "block"}
                setSources={setSources}
              />

              <ResponseDisplay aiResponse={aiResponse} sources={sources} />
            </div>
          </main>
          <DashboardFooter />
        </div>
      </div>
    </div>
  );
}
