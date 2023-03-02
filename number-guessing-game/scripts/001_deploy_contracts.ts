// deploy/00_deploy_my_contract.js
module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy} = deployments;
    const {app_developer} = await getNamedAccounts();
    await deploy('ERC20', {
        from: app_developer,
        args: [],
        log: true,
    });
};
module.exports.tags = ['ERC20'];