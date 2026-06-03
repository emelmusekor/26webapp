import os

# Map of Task ID to Filename (assuming standard naming I used in previous turns)
# I need to know the filenames.
# Based on prev turn, I generated: task_montage.html (A1), task_recipe.html (B1)...
# I should verify the filenames.
# I generated 20 new HTML files. I can infer them from curriculum_data, OR I can just iterate all .html files
# and check if they contain "const taskID = 'XX'".

HTML_FILES_DIR = "."

def update_html(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if it's one of the target files (contains taskID and engine init)
    if 'const taskID =' not in content or 'interactive_task_engine.js' not in content:
        return False
        
    # Extract ID
    # const taskID = 'A1';
    import re
    match = re.search(r"const taskID = '([A-Z0-9]+)'", content)
    if not match:
        return False
    
    task_id = match.group(1)
    
    # Replace script src
    new_script = f'<script src="js/tasks/{task_id}.js"></script>'
    
    # We replace:
    # <script src="js/interactive_task_engine.js"></script>
    # <script>
    #     const taskID = 'A1';
    #     window.engine = new TaskEngine(taskID, 'task-stage');
    #     engine.init();
    # </script>
    
    # The new JS file ALREADY does the init at the bottom: window.engine = new TaskA1...
    # So we should remove the manual init block too.
    
    # 1. Replace engine import
    content = content.replace('<script src="js/interactive_task_engine.js"></script>', new_script)
    
    # 2. Remove the manual init block (lines 44-48 in original)
    # Regex to remove the whole script block that does new TaskEngine
    # Pattern: <script>\s*const taskID = '...';\s*window.engine = ...\s*engine.init();\s*</script>
    
    # Simplest way: The new file needs NO manual init in HTML.
    # So we just delete that block? 
    # Wait, the new JS relies on 'task-stage' being present. It runs immediately at end of JS file.
    # So yes, we can remove the inline script.
    
    content = re.sub(r"<script>\s*const taskID = '[^']+';\s*window\.engine = new TaskEngine.*?\s*engine\.init\(\);\s*</script>", "", content, flags=re.DOTALL)
    
    # Also clean up empty lines left behind?
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Updated {filename} -> {task_id}.js")
    return True

# Iterate files
count = 0
for f in os.listdir(HTML_FILES_DIR):
    if f.endswith(".html") and f.startswith("task_"):
        if update_html(f):
            count += 1

print(f"Total updated: {count}")
