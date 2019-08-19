import axios from "axios";
import React from "react";
import { Mutation, Query } from "react-apollo";
import { RouteComponentProps } from "react-router-dom";
import { toast } from "react-toastify";
import { USER_PROFILE } from "../../sharedQueries.queries";

import {
  updateProfile,
  updateProfileVariables,
  userProfile
} from "../../types/api";
import { UPDATE_PROFILE } from "./EditAccount.queries";
import EditAccountPresenter from "./EditAccountPresenter";


interface IState {
  firstName: string;
  lastName: string;
  email: string;
  profilePhoto: string;
  loading: boolean;
  uploading: boolean;
}

interface IProps extends RouteComponentProps<any> {}

class ProfileQuery extends Query<userProfile> {}

class UpdateProfileMutation extends Mutation<
  updateProfile,
  updateProfileVariables
> {}

class EditAccountContainer extends React.Component<IProps, IState> {
  public state = {
    email: "",
    firstName: "",
    lastName: "",
    loading: true,
    profilePhoto: "",
    uploading: false
  };

  public render() {
    const { email, firstName, lastName, profilePhoto, loading, uploading } = this.state;
    return (
      <ProfileQuery 
        query={USER_PROFILE} 
        onCompleted={this.updateFields}
        fetchPolicy="no-cache"
      >
        {() => (
          <UpdateProfileMutation
            mutation={UPDATE_PROFILE}
            variables={{
              email,
              firstName,
              lastName,
              profilePhoto
            }}
            refetchQueries={[{query: USER_PROFILE}]}
            onCompleted={data => {
              const { UpdateMyProfile } = data;
              if(UpdateMyProfile.ok) {
                toast.success('Profile updated!')
              } else if (UpdateMyProfile.error) {
                toast.error(UpdateMyProfile.error);
              }
            }}
          >
            {(updateProfileMutation, { loading: updateLoading }) => (
              <EditAccountPresenter
                email={email}
                firstName={firstName}
                lastName={lastName}
                profilePhoto={profilePhoto}
                onInputChange={this.onInputChange}
                loading={updateLoading || loading}
                onSubmit={() => updateProfileMutation()}
                uploading={uploading}
              />
            )}
          </UpdateProfileMutation>
        )}
      </ProfileQuery>
    );
  }

  public onInputChange: React.ChangeEventHandler<HTMLInputElement> = async event => {
    const {
      target: { name, value, files }
    } = event;

    if (files) {
      this.setState({
        uploading: true
      });
      const formData = new FormData();
      formData.append("file", files[0]);
      formData.append("api_key", "193243387542668");
      formData.append("upload_preset", "xtaoaopp");
      formData.append("timestamp", String(Date.now() / 1000));
      const {
        data: { secure_url }
      } = await axios.post(
        "https://api.cloudinary.com/v1_1/dgggcrkxq/image/upload",
        formData
      );
      if (secure_url) {
        this.setState({
          profilePhoto: secure_url,
          uploading: false
        })
      }
    }

    this.setState({
      [name]: value
    } as any);
  };

  public updateFields = (data: {} | userProfile) => {
    if("GetMyProfile" in data) {
      const {
        GetMyProfile: { user }
      } = data;
      if(user) {
        const { firstName, lastName, email, profilePhoto } = user;
        const loading = false;
        this.setState({
          email,
          firstName,
          lastName,
          loading,
          profilePhoto,
        } as any);
      }
    }
  }
}

export default EditAccountContainer;

