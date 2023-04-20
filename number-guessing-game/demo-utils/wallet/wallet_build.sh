# script to build artifacts required for running tests 

script_path="$(cd "$(dirname "${0}")" && pwd)"
src_path="${script_path}/../../../../go-obscuro"

# run the wallet extension build
echo Building the wallet extension
cd $src_path/tools/walletextension/main

echo Building for target platform
go build -o ${script_path}/wallet_extension .
