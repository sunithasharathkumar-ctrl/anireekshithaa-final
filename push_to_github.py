import glob, os, subprocess

profile = os.environ.get('USERPROFILE', r'C:\Users\SHARATH')
git_matches = glob.glob(os.path.join(profile, r'AppData\Local\GitHubDesktop\app-*\resources\app\git\cmd\git.exe'))

git_exe = git_matches[0] if git_matches else r"C:\Program Files\Git\cmd\git.exe"

print(f"Using Git executable: {git_exe}")

def run(args):
    res = subprocess.run([git_exe] + args, capture_output=True, text=True, cwd=r"f:\AI Learnig - NEW SKILL\Insta\Anirikshitha")
    print(f"Executing: git {' '.join(args)}")
    print("STDOUT:", res.stdout)
    if res.stderr:
        print("STDERR:", res.stderr)
    return res.returncode

run(["add", "."])
run(["commit", "-m", "Remove screening details and ticket booking section"])
code = run(["push", "origin", "main"])
if code == 0:
    print("SUCCESSFULLY_PUSHED_TO_GITHUB")
