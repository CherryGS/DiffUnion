import os
from pathlib import Path

base = Path("../src/entity/")

d = [(Path("model.db"), base.joinpath("model"))]


for i, j in d:
    cmd = f"sea-orm-cli generate entity -u sqlite:{i.absolute()} -o {j.absolute()} --with-serde both --model-extra-derives ts_rs::TS --model-extra-attributes ts(export) --enum-extra-derives ts_rs::TS --enum-extra-attributes ts(export) --expanded-format"
    os.system(cmd)
    print(cmd)
