// method that return true if an user has the credentials to get access to any of our components
//actions param expects an action object with this structure 'action': 'actionurl'
//lactions param expects the action object thats stored in our Quasar LocalStorage
//if actions is empty the component will always show on the page
export function validateActions (actions: any, lactions: any) {
    const keys = Object.keys(actions);
    let result = true;
    keys.forEach((key) => {
      if (lactions[key] === undefined) {
        result = false;
      }
    });
    return result;
}