const { useSelector } = ReactRedux
import { utilService } from "../../services/util.service.js"

export function UserActivities() {
    const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)

    return (
        <section>
            <h3>Activities</h3>

            {loggedinUser.activities.length > 0 && <ul>
                {loggedinUser.activities.map(a => {
                    return < li key={a.at}>
                        <span>{utilService.formatTimeAgo(a.at)}</span>
                        <span>{a.txt}</span>
                    </li>
                })}
            </ul>}
        </section>
    )
}