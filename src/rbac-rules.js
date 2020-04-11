const rules = {
    GUEST: {
        static: ["posts:list", "home-page:visit"]
    },
    RESPONDER: {
        static: [
            "navbar:banner",
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
            "navbar:banner",
            "navbar:create-project",
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
            "navbar:banner",
            "navbar:create-project",
            "navbar:toggle-button",
            "navbar:request",
            "navbar:survey",
            "navbar:project",
            "navbar:user",
            "sidebar:recent-project",
            "sidebar:recent-other-survey",
            "sidebar:all-member",
            "sidebar:all-project",
            "survey-management:survey-profile",
            "list-project:delete-project",
        ]
    }
};

export default rules;