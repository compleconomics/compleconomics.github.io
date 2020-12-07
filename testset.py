import numpy as np
import pandas as pd

n = 500
lb = 1
ub = 200
df = pd.DataFrame({
    "source": np.random.randint(lb,ub,n),
    "target": np.random.randint(lb,ub,n),
    "value":  np.random.randint(lb,ub,n),
    "layer":  np.random.randint(1,3,n),
    "time":   np.random.randint(1,3,n)
})
df.to_csv("testset.csv")
