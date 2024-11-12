enum moduleType {
  activity = 0,
  project = 1,
}

type ActivityData = {
  id: string;
  title: string;
  type: moduleType;
  activities?: ActivityData[];
};

const data: ActivityData = {
  id: "root",
  title: "Root",
  type: moduleType.activity,
  activities: [
    // {
    //   id: "project-1",
    //   title: "Project 1",
    //   type: moduleType.project,
    // },
    {
      id: "activity-1",
      title: "Activity 1",
      type: moduleType.activity,
      activities: [
        {
          id: "activity-1-1",
          title: "Activity 1.1",
          type: moduleType.activity,
          activities: [
            {
              id: "activity-1-1-1",
              title: "Activity 1.1.1",

              type: moduleType.activity,
              activities: [
                {
                  id: "activity-1-1-1-1",
                  title: "Activity 1.1.1.1",
                  type: moduleType.activity,
                  activities: [
                    {
                      id: "activity-1-1-1-1-1",
                      title: "Activity 1.1.1.1.1",
                      type: moduleType.activity,
                    },
                    {
                      id: "activity-1-1-1-1-2",
                      title: "Activity 1.1.1.1.2",
                      type: moduleType.activity,
                    },
                  ],
                },
                {
                  id: "activity-1-1-1-2",
                  title: "Activity 1.1.1.2",
                  type: moduleType.activity,
                  activities: [
                    {
                      id: "activity-1-1-1-2-1",
                      title: "Activity 1.1.1.2.1",
                      type: moduleType.activity,
                    },
                    {
                      id: "activity-1-1-1-2-2",
                      title: "Activity 1.1.1.2.2",
                      type: moduleType.activity,
                    },
                  ],
                },
              ],
            },
            {
              id: "activity-1-1-2",
              title: "Activity 1.1.2",
              type: moduleType.activity,
              activities: [
                {
                  id: "activity-1-1-2-1",
                  title: "Activity 1.1.2.1",
                  type: moduleType.activity,
                  activities: [
                    {
                      id: "activity-1-1-2-1-1",
                      title: "Activity 1.1.2.1.1",
                      type: moduleType.activity,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "activity-1-2",
          title: "Activity 1.2",
          type: moduleType.activity,
          activities: [
            {
              id: "activity-1-2-1",
              title: "Activity 1.2.1",
              type: moduleType.activity,
            },
            {
              id: "activity-1-2-2",
              title: "Activity 1.2.2",
              type: moduleType.activity,
              activities: [
                {
                  id: "activity-1-2-2-1",
                  title: "Activity 1.2.2.1",
                  type: moduleType.activity,
                  activities: [
                    {
                      id: "activity-1-2-2-1-1",
                      title: "Activity 1.2.2.1.1",
                      type: moduleType.activity,
                    },
                    {
                      id: "activity-1-2-2-1-2",
                      title: "Activity 1.2.2.1.2",
                      type: moduleType.activity,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "activity-2",
      title: "Activity 2",
      type: moduleType.activity,
      activities: [
        {
          id: "activity-2-1",
          title: "Activity 2.1",
          type: moduleType.activity,
          activities: [
            {
              id: "activity-2-1-1",
              title: "Activity 2.1.1",
              type: moduleType.activity,
              activities: [
                {
                  id: "activity-2-1-1-1",
                  title: "Activity 2.1.1.1",
                  type: moduleType.activity,
                },
              ],
            },
          ],
        },
        {
          id: "activity-2-2",
          title: "Activity 2.2",
          type: moduleType.activity,
          activities: [
            {
              id: "activity-2-2-1",
              title: "Activity 2.2.1",
              type: moduleType.activity,
              activities: [
                {
                  id: "activity-2-2-1-1",
                  title: "Activity 2.2.1.1",
                  type: moduleType.activity,
                },
                {
                  id: "activity-2-2-1-2",
                  title: "Activity 2.2.1.2",
                  type: moduleType.activity,
                },
              ],
            },
            {
              id: "activity-2-2-2",
              title: "Activity 2.2.2",
              type: moduleType.activity,
            },
          ],
        },
      ],
    },
    {
      id: "activity-3",
      title: "Activity 3",
      type: moduleType.activity,
      activities: [
        {
          id: "activity-3-1",
          title: "Activity 3.1",
          type: moduleType.activity,
        },
        {
          id: "activity-3-2",
          title: "Activity 3.2",
          type: moduleType.activity,
          activities: [
            {
              id: "activity-3-2-1",
              title: "Activity 3.2.1",
              type: moduleType.activity,
            },
          ],
        },
      ],
    },
  ],
};

const data2 = {
  id: "root",
  title: "Root",
  type: moduleType.activity,
  activities: [
    {
      id: "activity-1",
      title: "Activity 1",
      type: moduleType.activity,

      activities: [
        {
          id: "activity-1-1",
          title: "Activity 1.1",
          type: moduleType.activity,

          activities: [
            {
              id: "activity-1-1-1",
              title: "Activity 1.1.1",
              type: moduleType.activity,

              activities: [
                {
                  id: "activity-1-1-1-1",
                  title: "Activity 1.1.1.1",
                  type: moduleType.activity,

                  activities: [
                    {
                      id: "activity-1-1-1-1-1",
                      title: "Activity 1.1.1.1.1",
                      type: moduleType.activity,
                    },
                  ],
                },
              ],
            },
            {
              id: "activity-1-1-2",
              title: "Activity 1.1.2",
              type: moduleType.activity,
              activities: [
                {
                  id: "activity-1-1-2-1",
                  title: "Activity 1.1.2.1",
                  type: moduleType.activity,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "activity-2",
      title: "Activity 2",
      type: moduleType.activity,
    },
  ],
};

export default data2;
