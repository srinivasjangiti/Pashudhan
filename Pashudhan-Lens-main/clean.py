import os
import shutil
import sys

def print_header():
    print("\033[96m" + "="*42)
    print("      🧹 PASHUDHAN LENS CLEANER 🧹")
    print("="*42 + "\033[0m")
    print("")

def clean_project():
    print_header()
    
    targets = [
        "node_modules",
        "dist",
        ".env",
        ".env.vercel",
        ".husky"
    ]
    
    print("\033[93m⚠️  This will delete the following:\033[0m")
    for target in targets:
        print(f"  - {target}")
    
    confirm = input("\nAre you sure you want to proceed? (y/N): ").strip().lower()
    if confirm != 'y':
        print("Operation cancelled.")
        return

    print("\n\033[93mCleaning project...\033[0m")
    
    for target in targets:
        if os.path.exists(target):
            try:
                if os.path.isdir(target):
                    shutil.rmtree(target)
                else:
                    os.remove(target)
                print(f"\033[92m✅ Removed {target}\033[0m")
            except Exception as e:
                print(f"\033[91m❌ Failed to remove {target}: {e}\033[0m")
        else:
            print(f"\033[90m⏭️  {target} not found (skipped)\033[0m")

    print("\n\033[92m✨ Project is now fresh and clean!\033[0m")
    print("You can run 'python setup.py' to start over.")

if __name__ == "__main__":
    # Enable colors in Windows terminal
    os.system('')
    clean_project()
