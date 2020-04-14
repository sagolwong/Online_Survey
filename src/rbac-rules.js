const rules = {
    GUEST: {
        static: ["posts:list", "home-page:visit"]
    },
    RESPONDER: {
        static: [
            "navbar:upgrade",
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
        dynamic: {
            "listSurvey:delete": ({ userId, surveyOwnerId }) => {
                if (!userId || !surveyOwnerId) return false;
                return userId === surveyOwnerId;
            },
            "listSampleGroup:delete": ({ userId, surveyOwnerId }) => {
                if (!userId || !surveyOwnerId) return false;
                return userId === surveyOwnerId;
            },
            "list-project:delete-project": ({ userId, surveyOwnerId }) => {
                if (!userId || !surveyOwnerId) return false;
                return userId === surveyOwnerId;
            }

        }
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
            "listSurvey:delete",
            "listSampleGroup:delete"
        ]
    }
};

export default rules;