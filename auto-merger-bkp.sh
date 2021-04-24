#!bin/sh
echo "Auto merger will sync the development branches with feature branches"
echo "Starting to update feature branches with development"


echo "executing git fetch -p origin"
git fetch -p origin

git pull --all

echo "Merging prod to qa"
git checkout production
git pull
echo "executing git checkout development"
git checkout qa
git pull
echo "executing git merge production"
git merge production
CONFLICTS=$(git ls-files -u | wc -l)
if [ "$CONFLICTS" -gt 0 ] ; then
	echo "There is a merge conflict. Aborting the merge on qa from production"
   	git merge --abort
else
	git push origin qa
fi

echo "Merging prod with hotfix"
for branch in $(git for-each-ref --format='%(refname)' refs/remotes/origin/hotfix); do
	branchModified=${branch#"refs/remotes/origin/"}
	echo "executing git checkout $branchModified"
	git checkout $branchModified
	git pull
	echo "executing git merge production"
	git merge --no-edit production
    	echo "executing git push origin $branchModified"
	CONFLICTS=$(git ls-files -u | wc -l)
	if [ "$CONFLICTS" -gt 0 ] ; then
   		echo "There is a merge conflict. Aborting the merge on $branchModified from production"
   		git merge --abort
	else
		git push origin $branchModified
	fi
done


echo "Merging qa with dev"
git checkout qa
git pull
echo "executing git checkout development"
git checkout development
echo "executing git merge qa"
git merge qa
CONFLICTS=$(git ls-files -u | wc -l)
if [ "$CONFLICTS" -gt 0 ] ; then
	echo "There is a merge conflict. Aborting the merge on dev from qa"
   	git merge --abort
else
	git push origin development
fi


echo "Merging qa to maintenance"
for branch in $(git for-each-ref --format='%(refname)' refs/remotes/origin/maintenance); do
	branchModified=${branch#"refs/remotes/origin/"}
	echo "executing git checkout $branchModified"
	git checkout $branchModified
	git pull
    	echo "executing git merge development"
	git merge --no-edit qa
    	echo "executing git push origin $branchModified"
	CONFLICTS=$(git ls-files -u | wc -l)
	if [ "$CONFLICTS" -gt 0 ] ; then
   		echo "There is a merge conflict. Aborting the merge on $branchModified from qa"
   		git merge --abort
	else
		git push origin $branchModified
	fi
done

echo "executing git checkout development"
git checkout development
git pull
echo "Merging dev to features"
for branch in $(git for-each-ref --format='%(refname)' refs/remotes/origin/feature); do
	branchModified=${branch#"refs/remotes/origin/"}
	echo "executing git checkout $branchModified"
	git checkout $branchModified
	git pull
    	echo "executing git merge development"
	git merge --no-edit development
    	echo "executing git push origin $branchModified"
	CONFLICTS=$(git ls-files -u | wc -l)
	if [ "$CONFLICTS" -gt 0 ] ; then
   		echo "There is a merge conflict. Aborting the merge on $branchModified from development"
   		git merge --abort
	else
		git push origin $branchModified
	fi
done

echo "Merging dev to defects"
for branch in $(git for-each-ref --format='%(refname)' refs/remotes/origin/defects); do
	branchModified=${branch#"refs/remotes/origin/"}
	echo "executing git checkout $branchModified"
	git checkout $branchModified
	git pull
    	echo "executing git merge development"
	git merge --no-edit development
    	echo "executing git push origin $branchModified"
	CONFLICTS=$(git ls-files -u | wc -l)
	if [ "$CONFLICTS" -gt 0 ] ; then
   		echo "There is a merge conflict. Aborting the merge on $branchModified from development"
   		git merge --abort
	else
		git push origin $branchModified
	fi
done


echo "Switching back to development"
git checkout development