const rules = {
    GUEST: {
        static: ["posts:list", "home-page:visit"]
    },
    RESPONDER: {
        static: [
            "navbar:toggle-button",
            "navbar:request",
            "navbar:survey",
            "navbar:user",
            "sidebar:link-profile",
            "sidebar:recent-other-survey",
            "user-profile:upgrade",
            "survey-management:survey-profile",
        ],
        /*dynamic: {
            "posts:edit": ({ userId, postOwnerId }) => {
                if (!userId || !postOwnerId) return false;
                return userId === postOwnerId;
            }
        }*/
    },
    RESEARCHER: {
        static: [
            "navbar:toggle-button",
            "navbar:request",
            "navbar:survey",
            "navbar:project",
            "navbar:user",
            "sidebar:link-profile",
            "sidebar:recent-project",
            "sidebar:recent-other-survey",
            "user-profile:show-more-profile",
            "survey-management:survey-profile",
        ],
       /* dynamic: {
            "posts:edit": ({ userId, postOwnerId }) => {
                if (!userId || !postOwnerId) return false;
                return userId === postOwnerId;
            }
        }*/
    },
    ADMIN: {
        static: [
            "navbar:toggle-button",
            "navbar:request",
            "navbar:survey",
            "navbar:project",
            "navbar:user",
            "sidebar:recent-project",
            "sidebar:recent-other-survey",
            "survey-management:survey-profile",
        ]
    }
};

export default rules;