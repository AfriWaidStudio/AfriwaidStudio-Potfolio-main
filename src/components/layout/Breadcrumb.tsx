import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { CLIENT_NAVIGATION } from "../../app/navigation";

export function Breadcrumb() {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  const breadcrumbs = [{ label: "Home", path: "/" }];

  for (let i = 0; i < pathSegments.length - 1; i++) {
    const segment = pathSegments[i];
    const path = "/" + pathSegments.slice(0, i + 1).join("/");
    
    const navItem = CLIENT_NAVIGATION.find(item => 
      item.path === path || item.children?.some(child => child.path === path)
    );
    
    const childItem = navItem?.children?.find(child => child.path === path);
    
    if (segment === "portal" || segment === "dashboard") continue;
    
    breadcrumbs.push({
      label: childItem?.label || navItem?.label || segment.charAt(0).toUpperCase() + segment.slice(1),
      path,
    });
  }

  const lastSegment = pathSegments[pathSegments.length - 1];
  const lastPath = "/" + pathSegments.join("/");
  
  const navItem = CLIENT_NAVIGATION.find(item => 
    item.path === lastPath || item.children?.some(child => child.path === lastPath)
  );
  const childItem = navItem?.children?.find(child => child.path === lastPath);

  if (childItem || navItem) {
    if (lastSegment !== "portal" && lastSegment !== "dashboard") {
      breadcrumbs.push({
        label: childItem?.label || navItem?.label || lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1),
        path: lastPath,
      });
    }
  }

  return (
    <nav className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-6">
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.path}>
          {index > 0 && <ChevronRight className="w-4 h-4 text-slate-400" />}
          {index === breadcrumbs.length - 1 ? (
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              {crumb.label}
            </span>
          ) : (
            <Link to={crumb.path} className="hover:text-blue-600">
              {crumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}