from pathlib import Path

import pandas as pd  # type: ignore[import-not-found]

# Load the new dataset from the user's Desktop
DATASET_PATH = Path.home() / 'Desktop' / 'Leetcode dataset' / 'leetcode_questions.csv'
df = pd.read_csv(DATASET_PATH)

df = df.drop(columns=['Dislikes', 'Hints', 'Question Slug', 'Likes', 'Similar Questions ID', 'Similar Questions Text'])
df = df.dropna(subset=['Question Text', 'Question ID', 'Question Title', 'Topic Tagged text', 'Difficulty Level', 'Success Rate'])
df = df.drop_duplicates()
df['Question Text'] = df['Question Text'].str.strip()
print(df.info())
df.to_csv(DATASET_PATH, index=False)
