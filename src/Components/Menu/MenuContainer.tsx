import React from "react";
import { Mutation, Query } from "react-apollo";
import { toast } from "react-toastify";
import { USER_PROFILE } from "../../sharedQueries.queries";
import { toggleDriving, userProfile } from "../../types/api";
import { TOGGLE_DRIVING } from "./Menu.queries";
import MenuPresenter from "./MenuPresenter";

class ProfileQuery extends Query<userProfile> {}
class ToggleDrivingMutation extends Mutation<toggleDriving> {}

class MenuContainer extends React.Component {
  public render() {
    return (
      <ToggleDrivingMutation
        mutation={TOGGLE_DRIVING}
        update={(cache, { data }) => {
          if(!data) {
            return;
          }
          const { ToggleDrivingMode } = data;
          if (!ToggleDrivingMode.ok) {
            toast.error(ToggleDrivingMode.error);
            return;
          }
          const query: userProfile | null = cache.readQuery({
            query: USER_PROFILE
          });
          if(!query) {
            return;
          }
          const {
            GetMyProfile: { user }
          } = query;

          if(user) {
            user.isDriving = !user.isDriving;
            cache.writeQuery({ query: USER_PROFILE, data: query });
          }
        }}
      >
        {toggleDrivingMutation => (
          <ProfileQuery query={USER_PROFILE}>
            {({ data, loading}) => (
              <MenuPresenter 
                data={data} 
                loading={loading}
                ToggleDrivingMutation={toggleDrivingMutation}
              />
            )}
          </ProfileQuery>
        )}
      </ToggleDrivingMutation>
      
    )
  }
}

export default MenuContainer;