import os
import sys
import subprocess

if __name__ == "__main__":
    app_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "Pashudhan-Lens-main")
    if os.path.exists(app_dir):
        os.chdir(app_dir)
        subprocess.call([sys.executable, "setup.py"])
    else:
        print("Error: Pashudhan-Lens-main directory not found.")
        sys.exit(1)
