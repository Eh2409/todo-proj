const { useSelector } = ReactRedux
import { utilService } from "../../services/util.service.js"

export function UserActivities() {
    const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)

    return (
        <section className="user-activities">
            <h3>Activities</h3>

            {loggedinUser.activities.length > 0 ? <ul>
                {loggedinUser.activities.map((a, idx) => {
                    return < li key={a.at + idx}>
                        <span>{utilService.formatTimeAgo(a.at)}</span>
                        <span>{a.txt}</span>
                    </li>
                })}
            </ul>
                : <div> - No activities yet. Start by adding one!</div>
            }

        </section>
    )
}