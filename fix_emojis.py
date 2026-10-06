with open('tienda-frontend/src/App.jsx', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

lines = text.split('\n')
for i, line in enumerate(lines):
    if 'text-[12rem]' in line:
        lines[i] = '          <div className="text-[12rem] opacity-20 absolute -right-10 md:static md:opacity-100">{"\\uD83C\\uDF70"}</div>'
    if 'animate-spin text-4xl' in line:
        lines[i] = '        {isLoading && <div className="text-center py-20"><div className="animate-spin text-4xl">{"\\uD83C\\uDF70"}</div><p className="text-stone-400 mt-4 uppercase tracking-widest text-sm font-bold">Preparando delicias...</p></div>}'

with open('tienda-frontend/src/App.jsx', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print("App.jsx fixed manually.")
