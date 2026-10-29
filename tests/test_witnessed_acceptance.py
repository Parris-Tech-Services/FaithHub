"""Real FaithHub end-user test wrappers, executed inside AgentWitness aw run.

Python pytest is the witnessed process. Its children execute the ACTUAL native
Node tests, real Chromium UI journey, and Vite build. Never replace these with
synthetic 'PASS' output or assert the live GitHub Pages deploy is on this PR SHA.
"""
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[1]


def exercise(args, timeout=180):
    completed = subprocess.run(args, cwd=ROOT, text=True,
                               capture_output=True, timeout=timeout, check=False)
    assert completed.returncode == 0, (
        f"Real command failed: {args[0]} {args[1:]}\n"
        f"STDOUT: {completed.stdout[-2200:]}\n"
        f"STDERR: {completed.stderr[-2200:]}"
    )


def test_real_faithhub_node_regressions():
    tests = sorted((ROOT / "scripts").glob("*.test.mjs"))
    assert len(tests) >= 2, "No real application tests discovered"
    exercise(["node", "--test", *(str(t) for t in tests)])


def test_actual_chromium_mobile_and_desktop_journey():
    assert (ROOT / "scripts/psalms-browser.mjs").is_file()
    exercise(["node", "scripts/psalms-browser.mjs"], timeout=240)


def test_actual_production_vite_build():
    exercise(["npm", "run", "build"])
    assert (ROOT / "dist/index.html").is_file()
    assert (ROOT / "dist/psalms.html").is_file()
    html = (ROOT / "dist/psalms.html").read_text(encoding="utf-8")
    assert "podcast-launcher-v3.js" not in html, "Private reflections include third-party launcher"
