import os
import subprocess
import sys
import webbrowser
import time

def print_header():
    print("\033[96m" + "="*42)
    print("      🐄 PASHUDHAN LENS SETUP 🐄")
    print("="*42 + "\033[0m")
    print("")

def check_node():
    print("\033[93m🔍 Checking system requirements...\033[0m")
    try:
        # Check if node is installed
        version = subprocess.check_output(["node", "-v"], shell=True).decode().strip()
        print(f"\033[92m✅ Node.js is installed ({version})\033[0m")
        return True
    except subprocess.CalledProcessError:
        print("\033[91m❌ Node.js is NOT installed.\033[0m")
        print("Please install Node.js from https://nodejs.org/")
        webbrowser.open("https://nodejs.org/")
        input("Press Enter after you have installed Node.js to continue...")
        
        # Check again
        try:
            subprocess.check_call(["node", "-v"], shell=True, stdout=subprocess.DEVNULL)
            return True
        except:
            return False

def install_dependencies():
    print("\n\033[93m📦 Installing Dependencies...\033[0m")
    print("Creating isolated virtual environment (node_modules) to keep your system clean...")
    try:
        subprocess.check_call(["npm", "install"], shell=True)
        print("\033[92m✅ Virtual environment created and dependencies installed!\033[0m")
    except subprocess.CalledProcessError:
        print("\033[91m❌ Failed to install dependencies.\033[0m")
        sys.exit(1)

def setup_environment():
    print("\n\033[93m⚙️  Configuring Environment...\033[0m")
    env_file = ".env"
    
    # Check if env file exists
    if os.path.exists(env_file):
        print("\033[92m✅ Found existing configuration.\033[0m")
        reconfigure = input("Do you want to re-enter your API keys? (y/N): ").strip().lower()
        if reconfigure != 'y':
            return

    print("\033[96m🔑 We need a few API keys to get started.\033[0m")
    print("You can press Enter to skip, but AI features won't work.")
    
    gemini_key = input("\nEnter Google Gemini API Key: ").strip()
    clerk_key = input("Enter Clerk Publishable Key: ").strip()
    
    content = f"VITE_GEMINI_API_KEY={gemini_key}\nVITE_CLERK_PUBLISHABLE_KEY={clerk_key}"
    
    with open(env_file, "w") as f:
        f.write(content)
    
    # Also create .env.vercel
    with open(".env.vercel", "w") as f:
        f.write(content)
        
    print("\033[92m✅ Configuration saved!\033[0m")

def start_app():
    print("\n\033[92m🚀 Starting Pashudhan Lens...\033[0m")
    print("The application will open in your default browser.")
    
    # Use npm run dev -- --open to let Vite handle opening the browser on the correct port
    try:
        # Windows requires shell=True for npm
        subprocess.check_call(["npm", "run", "dev", "--", "--open"], shell=True)
    except KeyboardInterrupt:
        print("\nStopped.")

def ask_cleanup():
    print("\n\033[93m🧹 Cleanup Option\033[0m")
    choice = input("Do you want to run the cleanup script now? (y/N): ").strip().lower()
    if choice == 'y':
        if os.path.exists("clean.py"):
            subprocess.call([sys.executable, "clean.py"])
        else:
            print("\033[91m❌ clean.py not found.\033[0m")

def main():
    # Enable colors in Windows terminal
    os.system('')
    
    print_header()
    
    if check_node():
        install_dependencies()
        setup_environment()
        start_app()
        ask_cleanup()
    else:
        print("\n\033[91m❌ Setup failed: Node.js is required.\033[0m")
        input("Press Enter to exit...")

if __name__ == "__main__":
    main()
