
package com.medistock.model;

public class Activity {

    private int id;
    private String medicineName;
    private String action;
    private String description;
    private String activityDate;

    // Default constructor
    public Activity() {
    }

    // Parameterized constructor
    public Activity(int id, String medicineName, String action,
                    String description, String activityDate) {
        this.id = id;
        this.medicineName = medicineName;
        this.action = action;
        this.description = description;
        this.activityDate = activityDate;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getMedicineName() {
        return medicineName;
    }

    public void setMedicineName(String medicineName) {
        this.medicineName = medicineName;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getActivityDate() {
        return activityDate;
    }

    public void setActivityDate(String activityDate) {
        this.activityDate = activityDate;
    }
}
