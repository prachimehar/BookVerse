package com.bookverse.user.Context;

public class UserContext {

    public static final String DEMO_USER_ID = "user-reader";
    public static final String DEMO_USER_NAME = "BookVerse Guest";

    public static String userId(String headerUserId) {
        return headerUserId == null || headerUserId.isBlank() ? DEMO_USER_ID : headerUserId;
    }

    public static String userName(String headerUserName) {
        return headerUserName == null || headerUserName.isBlank() ? DEMO_USER_NAME : headerUserName;
    }

}
