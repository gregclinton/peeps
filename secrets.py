def get(key):
    return dict(line.split(',') for line in open('secrets').read().splitlines())[key]
