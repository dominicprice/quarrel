enum Dir {
    Across = 0,
    Down = 1,
}

function toggleDir(dir: Dir): Dir {
    return dir === Dir.Across ? Dir.Down : Dir.Across;
}

export default Dir;
export { toggleDir };
