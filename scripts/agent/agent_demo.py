import os
import asyncio
import argparse
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from browser_use import Agent

# Load environment variables from the Next.js .env.local file
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env.local')
load_dotenv(dotenv_path=env_path)

# Verify API key is present
api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
if not api_key:
    print("❌ ERROR: GEMINI_API_KEY or GOOGLE_API_KEY not found in .env.local")
    print("Please add it: GEMINI_API_KEY=\"your-key-here\"")
    exit(1)

# Ensure LangChain uses the key
os.environ["GOOGLE_API_KEY"] = api_key

async def run_agent(task_description: str):
    print(f"🚀 Initializing Gemini Vision Agent for task: '{task_description}'")
    
    # Initialize the LLM (Gemini 1.5 Flash is incredibly fast and free-tier friendly for UI automation)
    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        temperature=0.0
    )
    
    # Create the browser-use agent
    agent = Agent(
        task=task_description,
        llm=llm
    )
    
    print("👀 Starting browser automation...")
    try:
        # Run the agent
        result = await agent.run()
        print("\n✅ Task Completed Successfully!")
        print("Result Summary:")
        print(result)
    except Exception as e:
        print(f"\n❌ Task Failed: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Run Browser-Use Agent with Gemini')
    parser.add_argument('--task', type=str, default="Go to google.com and search for 'latest AI news 2024' and give me the top 3 headlines.", help='The task you want the agent to perform')
    
    args = parser.add_argument()
    args = parser.parse_args()
    
    asyncio.run(run_agent(args.task))
