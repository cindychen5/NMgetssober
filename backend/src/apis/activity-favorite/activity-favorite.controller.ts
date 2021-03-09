import {Request, Response} from 'express';

// DB

// Interfaces (represent the DB model and types of the columns associated with a specific DB table)
import {Status} from '../../utils/interfaces/Status';
import {Profile} from "../../utils/interfaces/Profile";
import {ActivityFavorite} from "../../utils/interfaces/ActivityFavorite";
import {selectActivityFavoriteByActivityFavoriteId} from "../../utils/activity-favorite/selectActivityFavoriteByActivityFavoriteId";
import {deleteActivityFavorite} from "../../utils/activity-favorite/deleteActivityFavorite";
import {insertActivityFavorite} from "../../utils/activity-favorite/insertActivityFavorite";
//add profile to interfaces

export async function toggleActivityFavoriteController(request: Request, response: Response) {

    try {
        const {activityFavoriteActivityId} = request.body;
        const profile: Profile = request.session?.profile
        const activityFavoriteProfileId = <string>profile.profileId

        const activityFavorite: ActivityFavorite = {
            activityFavoriteProfileId,
            activityFavoriteActivityId,

        }
        const select = await selectActivityFavoriteByActivityFavoriteId(activityFavorite)
        // @ts-ignore
        if (select[0]){
            const result = await deleteActivityFavorite(activityFavorite)
        }else{
            const result = await insertActivityFavorite(activityFavorite)
        }

        const status: Status = {
            status: 200,
            message: 'Favorite successfully updated',
            data: null
        };
        return response.json(status);

    } catch(error) {
        console.log(error);
    }
}