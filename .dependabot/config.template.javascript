  - package_manager: "javascript"
    directory: "/"
    update_schedule: "live"
    commit_message:
       prefix: "[FF-1429]" 
    default_reviewers:
       - "credfeto"
    default_assignees:
       - "credfeto"
    allowed_updates:
       - match:
          update_type: all
          dependency_type: indirect
